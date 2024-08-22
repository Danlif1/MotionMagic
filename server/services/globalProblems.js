const {Problem, User} = require('../models/motion');

async function byTime(){
    try {
        const problems = await Problem.find()
            .sort({ Time: -1 })  // Sort by Time in descending order
            .limit(5);           // Limit to the 5 newest problems
        return problems;
    } catch (error) {
        console.error('Error fetching problems by time:', error);
        return null;
    }
}

async function byMostLikes(){
    try {
        const problems = await Problem.find()
            .sort({ Likes: -1 })  // Sort by Time in descending order
            .limit(5);           // Limit to the 5 newest problems
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
    if (problem.Likes.includes(username)) {
        // Remove like
        problem.Likes.filter(u => u !== username);
        await problem.save();
        user.starredProblems.filter(p => p.ID !== problemID);
        await user.save();
        return 200;
    } else {
        problem.Likes.push(username);
        await problem.save();
        user.starredProblems.push(problem);
        await user.save();
    }
    return problem;
}

module.exports = {
    byTime,
    byMostLikes,
    likeProblem
};