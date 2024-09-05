const {Problem, User} = require('../models/motion');
const {saveProblemToAll} = require("./generalFunctions");
const generateID = require("../middleware/IDgenerator");

async function byTime(nop){
    if (!nop) {
        nop = 5
    }
    try {
        return await Problem.find({ Public: true })
            .sort({Time: -1})  // Sort by Time in descending order
            .limit(nop);
    } catch (error) {
        console.error('Error fetching problems by time:', error);
        return null;
    }
}

async function byMostLikes(nop){
    if (!nop) {
        nop = 5
    }
    try {
        return await Problem.find({ Public: true })
            .sort({Likes: -1})  // Sort by Likes in descending order
            .limit(nop);
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
    if (problem.Likes.includes(username)) {
        // Remove like
        problem.Likes.filter(u => u !== username);
        await problem.save();
        user.LikedProblems.filter(p => p.ID !== problemID);
        await user.save();
        await saveProblemToAll(problemID, problem);
        return "Removed like";
    } else {
        problem.Likes.push(username);
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
}

module.exports = {
    byTime,
    byMostLikes,
    likeProblem,
    commentProblem
};