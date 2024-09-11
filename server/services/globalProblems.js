const {Problem, User, Comment} = require('../models/motion');
const {saveProblemToAll} = require("./generalFunctions");
const generateID = require("../middleware/IDgenerator");

async function byTime(nop, username){
    if (!nop) {
        nop = 5
    }
    try {
        let problems =  await Problem.find({ Public: true })
            .sort({Time: -1})  // Sort by Time in descending order
            .limit(nop);
        for (let problem of problems) {
            if (!problem.Viewers.includes(username)) {
                problem.Viewers.push(username);
                problem.Views += 1;
                await problem.save();
                await saveProblemToAll(problem.ID, problem);
            } else {
                problem.Views += 1;
            }
        }
        return problems;
    } catch (error) {
        console.error('Error fetching problems by time:', error);
        return null;
    }
}

function compareFunctionLikes(a,b) {
    if (a.length > b.length) {
        return 1;
    } else {
        return -1;
    }
}

async function byMostLikes(nop, username){
    if (!nop) {
        nop = 5
    }
    try {
        let problems =  await Problem.find({ Public: true })
            .sort(compareFunctionLikes)  // Sort by Likes in descending order
            .limit(nop);
        for (let problem of problems) {
            if (!problem.Viewers.includes(username)) {
                problem.Viewers.push(username);
                problem.Views += 1;
                await problem.save();
                await saveProblemToAll(problem.ID, problem);
            } else {
                problem.Views += 1;
            }
        }
        return problems;
    } catch (error) {
        console.error('Error fetching problems by time:', error);
        return null;
    }
}

async function likeProblem(problemID, username) {
    const problem = await Problem.findOne({ ID: problemID });
    const user = await User.findOne({ Username: username });
    if (!problem || !user) {
        return null
    }
    if (problem.Likes.includes(user.Username)) {
        // Remove like
        problem.Likes = problem.Likes.filter(u => u !== user.Username);
        await problem.save();
        user.LikedProblems = user.LikedProblems.filter(p => p.ID !== problemID);
        await user.save();
        await saveProblemToAll(problemID, problem);
        return "Removed like";
    } else {
        problem.Likes.push(user.Username);
        await problem.save();
        user.LikedProblems.push(problem);
        await user.save();
        await saveProblemToAll(problemID, problem);
    }
    return "Liked problem";
}

async function commentProblem(problemID, comment, username) {
    const problem = await Problem.findOne({ ID: problemID });
    const user = await User.findOne({ Username: username });
    if (!problem || !user || !comment) {
        return null
    }
    let newID;
    while (true) {
        newID = generateID(16);
        const checkProblem = await Problem.findOne({ ID: newID });
        if (!checkProblem) {
            break;
        }
    }
    const newComment = await new Comment({
        ID: newID,
        Creator: user.DisplayName,
        CreatorImg: user.ProfilePicture,
        Content: comment
    })
    await newComment.save();
    problem.Comments.push(newComment);
    await problem.save()
    await saveProblemToAll(problemID, problem);
    return true;
}

async function getProblem(problemID) {
    const problem = await Problem.findOne({ ID: problemID });
    if (problem.Public) {
        return problem;
    } else {
        return null;
    }
}

async function publishProblem(problemID, username) {
    const problem = await Problem.findOne({ ID: problemID });
    const user = await User.findOne({ Username: username });
    if (!user || !problem) {
        return [404, 'Problem not found'];
    } else if (problem.CreatorUsername !== username) {
        return [403, 'You are not the creator'];
    }
    problem.Public = !problem.Public;
    await problem.save()
    const problemIndex = user.Problems.findIndex(p => p.ID === problemID);
    user.Problems[problemIndex].Public = !user.Problems[problemIndex].Public;
    await user.save();
    await saveProblemToAll(problemID, problem);
    if (problem.Public) {
        return [200, 'Published problem'];
    } else {
        return [200, 'Unpublished problem'];
    }
}

module.exports = {
    byTime,
    byMostLikes,
    likeProblem,
    commentProblem,
    getProblem,
    publishProblem
};