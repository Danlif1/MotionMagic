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

async function stringToMap(mapStr) {
    // Remove curly braces and split the string into key-value pairs
    const pairs = mapStr.slice(1, -1).split(',');

    // Convert each key-value pair to an array
    const entries = pairs.map(pair => {
        const [key, value] = pair.split(':');
        // Handle value which could be a fraction
        return [key.trim().toString(), eval(value.trim())];
    });

    // Create and return the Map
    return Object.fromEntries(entries);
}


module.exports = {
    saveProblemToAll,
    stringToMap
};