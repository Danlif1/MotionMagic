const {Problem, User} = require('../models/motion');

async function byTime(nop){
    if (!nop) {
        nop = 5
    }
    try {
        // Limit to the 5 newest problems
        return await Problem.find()
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
        // Limit to the 5 newest problems
        return await Problem.find()
            .sort({Likes: -1})  // Sort by Time in descending order
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
        user.starredProblems.filter(p => p.ID !== problemID);
        await user.save();
        return "Removed like";
    } else {
        problem.Likes.push(username);
        await problem.save();
        user.starredProblems.push(problem);
        await user.save();
    }
    return "Liked problem";
}

module.exports = {
    byTime,
    byMostLikes,
    likeProblem
};