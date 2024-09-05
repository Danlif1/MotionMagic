const globalProblemService = require('../services/globalProblems');

async function byTime(req, res){
    let result;
    try {
        result = await globalProblemService.byTime(req.params.nop, req.user.username);
    } catch {
        result = await globalProblemService.byTime(req.params.nop, "unnamed");
    }
    if (!result) {
        return res.status(404).json({ error: "problems not found" });
    } else {
        return res.status(200).json(result);
    }
}

async function byMostLikes(req, res){
    let result;
    try {
        result = await globalProblemService.byMostLikes(req.params.nop, req.user.username);
    } catch {
        result = await globalProblemService.byMostLikes(req.params.nop, "unnamed");
    }
    if (!result) {
        return res.status(404).json({ error: "problems not found" });
    } else {
        return res.status(200).json(result);
    }
}

async function likeProblem(req, res){
    const result = await globalProblemService.likeProblem(req.params.pid, req.user.username);
    if (!result) {
        return res.status(500).json({ error: "couldn't like problem" });
    } else {
        return res.status(200).json({ message: result });
    }
}

async function commentProblem(req, res){
    const result = await globalProblemService.commentProblem(req.params.pid, req.body.commentProblem, req.user.username);
    if (!result) {
        return res.status(500).json({ error: "couldn't like problem" });
    } else {
        return res.status(200).json({ message: result });
    }
}

module.exports = {
    byMostLikes,
    byTime,
    likeProblem,
    commentProblem
};