const {User, Problem, Rider, RiderData} = require('../models/motion');
const mongoose = require("mongoose");
const {logErrorToFile, logActionToFile, logForbiddenToFile, logInternalErrorToFile} = require('../middleware/logger.js');
const {sendToMultithreadedServer} = require("../connectTCPServer");
const generateID = require("../middleware/IDgenerator")

async function solveProblem(equations, username, paths, riders, riderData, isPublic){
    if (!equations || !paths || !riders || !riderData) {
        return null;
    }
    isPublic = isPublic === "true";
    let creator = await User.findOne({ Username: username });
    let result = await sendToMultithreadedServer(JSON.stringify(equations));
    if (!result || !creator) {
        return null;
    } else {
        let newID;
        while (true) {
            newID = generateID(16);
            const checkProblem = await Problem.findOne({ ID: newID });
            if (!checkProblem) {
                break;
            }
        }
        let _riders = []
        for (let rider in riders) {
            let _rider = await new Rider({
                Name: rider["name"],
                Paths: rider["paths"]
            })
            _riders.push(_rider)
        }
        let _ridersData = new Map();
        for (const [key, value] of riderData) {
            let data = []
            for (let rider in value) {
                let single_data = await new RiderData({
                    Path: rider["path"],
                    Time: rider["time"],
                    Velocity: rider["velocity"],
                    Distance: rider["distance"]
                });
                data.push(single_data)
            }
            _ridersData[key] = data
        }
        const problem = await new Problem({
            ID: newID,
            Equations: equations,
            Solution: result,
            Creator: username,
            Paths: paths,
            Riders: _riders,
            RiderData: _ridersData,
            Likes: [],
            Public: isPublic
        })

        await problem.save();
        creator.Problems.push(problem);
        await creator.save();
        return result;
    }
}

async function getMyProblems(username) {
    let user = await User.findOne({ Username: username });
    if (!user) {
        logErrorToFile("Fake user: " + username + " tried accessing his problems");
        return null;
    }
    logActionToFile("User: " + username + " accessed his problems");
    return user.Problems;
}

async function getStarredProblems(username) {
    let user = await User.findOne({ Username: username });
    if (!user) {
        logErrorToFile("Fake user: " + username + " tried accessing his problems");
        return null;
    }
    logActionToFile("User: " + username + " accessed his problems");
    return user.starredProblems;
}

async function deleteProblem(username, problemID) {
    let user = await User.findOne({ Username: username});
    let problem = await Problem.findOne({ ID: problemID });
    if (problem.Creator !== username) {
        return [403, "You are not the creator"];
    }
    let _problem = await Problem.findOneAndDelete({ ID: problemID });
    user.Problems = user.Problems.filter(p => p.ID !== problemID);
    await user.save();
    await User.updateMany(
        { 'starredProblems.ID': problemID },
        { $pull: { starredProblems: { ID: problemID } } }
    );
    return [200, "Problem deleted successfully"];
}

module.exports = {
    solveProblem,
    getMyProblems,
    getStarredProblems,
    deleteProblem
};