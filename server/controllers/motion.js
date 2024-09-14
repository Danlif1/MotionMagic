const problemService = require('../services/motion');

async function solveProblem(req, res) {
    const solution = await problemService.solveProblem(req.body.equations, req.user.username,
                                                        req.body._paths, req.body.riders, req.body.riderData,
                                                        req.body.isPublic);
    if (!solution) {
        return res.status(500).json({ error: 'Error finding a solution' });
    }
    res.status(200).json({ message: 'Success', solution: solution });
}

async function getProblem(req, res) {
    const problem = await problemService.getProblem(req.params.pid, req.user.username);
    if (!problem) {
        return res.status(404).json({ error: "could not find problem" });
    }
    res.status(200).json({ message: 'Success', problem: problem});
}

async function myProblems(req, res) {
    const problems = await problemService.getMyProblems(req.user.username);
    if (!problems) {
        return res.status(404).json({ error: 'Error couldn\'t find problems' });
    }
    res.status(200).json({ message: 'Success', problems: problems });
}

async function likedProblems(req, res) {
    const problems = await problemService.getLikedProblems(req.user.username);
    if (!problems) {
        return res.status(404).json({ error: 'Error couldn\'t find liked problems' });
    }
    res.status(200).json({ message: 'Success', problems: problems });

}

async function deleteProblem(req, res) {
    const status = await problemService.deleteProblem(req.user.username, req.params.pid);
    return res.status(status[0]).json({ message: status[1] });
}

async function saveDraft(req, res) {
    const result = await problemService.saveDraft(req.body._paths, req.body.riders, req.body.riderData,
                                                    req.body.equations, req.user.username);
    return res.status(result[0]).json({ message: result[1] })
}

async function deleteDraft(req, res) {
    const status = await problemService.deleteDraft(req.user.username, req.params.did);
    return res.status(status[0]).json({ message: status[1] });
}

module.exports = {
    solveProblem,
    getProblem,
    myProblems,
    likedProblems,
    deleteProblem,
    saveDraft,
    deleteDraft
};