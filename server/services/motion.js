const {User, Problem} = require('../models/motion');
const mongoose = require("mongoose");
const {logErrorToFile, logActionToFile, logForbiddenToFile, logInternalErrorToFile} = require('../middleware/logger.js');
const {sendToMultithreadedServer} = require("../connectTCPServer");
const generateID = require("../middleware/IDgenerator")

async function solveProblem(equations, username){
    if (!equations) {
        return null;
    }
    let result = await sendToMultithreadedServer(JSON.stringify(equations));
    if (!result) {
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
        const problem = await new Problem({
            ID: newID,
            Equations: equations,
            Solution: result,
            Creator: username,
            Likes: []
        })
        await problem.save();
        let creator = await User.findOne({ Username: username });
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