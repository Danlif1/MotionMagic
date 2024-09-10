const {User, Problem, Draft, Rider, RiderData} = require('../models/motion');
const mongoose = require("mongoose");
const {logErrorToFile, logActionToFile, logForbiddenToFile, logInternalErrorToFile} = require('../middleware/logger.js');
const {sendToMultithreadedServer} = require("../connectTCPServer");
const generateID = require("../middleware/IDgenerator")
const {stringToMap} = require("./generalFunctions");

async function solveProblem(equations, username, paths, riders, riderData, isPublic){
    if (!equations || !paths || !riders || !riderData) {
        return null;
    }
    isPublic = isPublic === "true";
    let creator = await User.findOne({ Username: username });
    let result = await sendToMultithreadedServer(JSON.stringify(equations));
    result[1] = await stringToMap(result[1]);
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
        let _riders = [];
        for (let rider of riders) {
            let _rider = await new Rider({
                Name: rider.name,
                Paths: rider.paths
            });
            await _rider.save();
            _riders.push(_rider);
        }
        const _ridersData = new Map();
        for (const [key, value] of Object.entries(riderData)) {
            let data = [];
            for (const rider of value) {
                let single_data = await new RiderData({
                    Path: rider.path,
                    Time: rider.time,
                    Velocity: rider.velocity,
                    Distance: rider.distance
                });
                await single_data.save();
                data.push(single_data);
            }
            _ridersData.set(key, data);
        }
        const problem = await new Problem({
            ID: newID,
            Equations: equations,
            Solution: result[0],
            FinalSolution: result[1],
            Creator: creator.DisplayName,
            CreatorUsername: username,
            CreatorProfilePic: creator.ProfilePicture,
            Time: Date.now(),
            Paths: paths,
            Riders: _riders,
            RidersData: _ridersData,
            Likes: [],
            Viewers: [],
            Comments: [],
            Public: isPublic
        })

        await problem.save();
        creator.Problems.push(problem);
        await creator.save();
        return result;
    }
}


async function getProblem(problemID, username) {
    const problem = await Problem.findOne({ ID: problemID });
    const user = await User.findOne({ Username: username });
    if (!user || !problem) {
        return null;
    }
    if (problem.CreatorUsername === username) {
        return problem;
    } else {
        return null;
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

async function getLikedProblems(username) {
    let user = await User.findOne({ Username: username });
    if (!user) {
        logErrorToFile("Fake user: " + username + " tried accessing his problems");
        return null;
    }
    logActionToFile("User: " + username + " accessed his problems");
    return user.LikedProblems;
}

async function deleteProblem(username, problemID) {
    let user = await User.findOne({ Username: username});
    let problem = await Problem.findOne({ ID: problemID });
    if (problem.Creator !== username) {
        return [403, "You are not the creator"];
    }
    await Problem.findOneAndDelete({ ID: problemID });
    user.Problems = user.Problems.filter(p => p.ID !== problemID);
    await user.save();
    await User.updateMany(
        { 'LikedProblems.ID': problemID },
        { $pull: { LikedProblems: { ID: problemID } } }
    );
    return [200, "Problem deleted successfully"];
}

async function saveDraft(paths, riders, riderData, equations, username) {
    if (!paths || !riders || !riderData) {
        return null;
    }
    let creator = await User.findOne({ Username: username });
    if (!creator) {
        return [null, "Could not save draft"];
    } else {
        let newID;
        while (true) {
            newID = generateID(16);
            const checkProblem = await Problem.findOne({ ID: newID });
            if (!checkProblem) {
                break;
            }
        }
        let _riders = [];
        for (let rider of riders) {
            let _rider = await new Rider({
                Name: rider.name,
                Paths: rider.paths
            });
            await _rider.save();
            _riders.push(_rider);
        }

        const _ridersData = new Map();
        for (const [key, value] of Object.entries(riderData)) {
            let data = [];
            for (const rider of value) {
                let single_data = await new RiderData({
                    Path: rider.path,
                    Time: rider.time,
                    Velocity: rider.velocity,
                    Distance: rider.distance
                });
                await single_data.save();
                data.push(single_data);
            }
            _ridersData.set(key, data);
        }
        const draft = await new Draft({
            ID: newID,
            Creator: creator.DisplayName,
            CreatorUsername: username,
            CreatorProfilePic: creator.ProfilePicture,
            Time: Date.now(),
            Equations: equations,
            Paths: paths,
            Riders: _riders,
            RidersData: _ridersData
        })

        await draft.save();
        creator.Drafts.push(draft);
        await creator.save();
        return [200, "Draft saved successfully"];
    }

}

async function deleteDraft(username, draftID) {
    let user = await User.findOne({ Username: username});
    let problem = await Draft.findOne({ ID: draftID });
    if (problem.Creator !== username) {
        return [403, "You are not the creator"];
    }
    await Draft.findOneAndDelete({ ID: draftID });
    user.Drafts = user.Drafts.filter(p => p.ID !== draftID);
    await user.save();
    return [200, "Problem deleted successfully"];
}

module.exports = {
    solveProblem,
    getProblem,
    getMyProblems,
    getLikedProblems,
    deleteProblem,
    saveDraft,
    deleteDraft
};