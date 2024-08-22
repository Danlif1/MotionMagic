const problemService = require('../services/motion');

async function solveProblem(req, res) {
    const solution = await problemService.solveProblem(req.body.equations, req.user.username);
    if (!solution) {
        return res.status(500).json({ error: 'Error finding a solution' });
    }
    res.status(200).json({ message: 'Success', solution: solution });
}

async function myProblems(req, res) {
    const problems = await problemService.getMyProblems(req.user.username);
    if (!problems) {
        return res.status(404).json({ error: 'Error couldn\'t find problems' });
    }
    res.status(200).json({ message: 'Success', problems: problems });
}

async function starredProblems(req, res) {
    const problems = await problemService.getStarredProblems(req.user.username);
    if (!problems) {
        return res.status(404).json({ error: 'Error couldn\'t find starred problems' });
    }
    res.status(200).json({ message: 'Success', problems: problems });

}

async function deleteProblem(req, res) {
    const status = await problemService.deleteProblem(req.user.username, req.params.pid);
    return res.status(status[0]).json({ message: status[1] });
}

module.exports = {
    solveProblem,
    myProblems,
    starredProblems,
    deleteProblem
};