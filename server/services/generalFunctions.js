const {Problem, User} = require('../models/motion');

async function saveProblemToAll(problemID, newProblem) {
    const users = await User.find();

    for (const user of users) {
        let foundProblem = user.Problems.find(problem => problem.ID === problemID);
        if (foundProblem) {
            foundProblem = newProblem;
        }

        foundProblem = user.LikedProblems.find(problem => problem.ID === problemID);
        if (foundProblem) {
            foundProblem = newProblem;
        }
        await user.save()

    }
}

module.exports = {
    saveProblemToAll
};