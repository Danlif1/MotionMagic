const globalProblemService = require('../services/globalProblems');

async function byTime(req, res){
    const result = await globalProblemService.byTime();
    if (!result) {
        return res.status(404).json({ error: "problems not found" });
    } else {
        return res.status(200).json(result);
    }
}

async function byMostLikes(req, res){
    const result = await globalProblemService.byMostLikes();
    if (!result) {
        return res.status(404).json({ error: "problems not found" });
    } else {
        return res.status(200).json(result);
    }
}

async function likeProblem(req, res){
    const result = await globalProblemService.likeProblem(req.params.pid, req.headers.username);
    if (!result) {
        return res.status(500).json({ error: "couldn't like problem" });
    } else {
        return res.status(200).json(result);
    }
}

module.exports = {
    byMostLikes,
    byTime,
    likeProblem
};