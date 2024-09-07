const viewController = require('../controllers/globalProblems');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

/**
 * This is get all problems sorted by likes request.
 * No body, no headers required, AKA everyone can view it even if not registered.
 * Params: number of problems.
 * The result will be a list of problems with the structure:
 * ID: {type: String},
 * Creator: {type: String},
 * Time: {type: Date (Creation date)},
 * Equations: [{type: String}],
 * Solution: [{type: String}],
 * Likes: [{type: String}],
 * Views: {type: Number}
 */
router.get('/api/viewProblems/mostLikes/:nop', viewController.byMostLikes);

/**
 * This is get all problems sorted by times request.
 * No body, no headers required, AKA everyone can view it even if not registered.
 * Params: number of problems.
 * The result will be a list of problems with the structure:
 * ID: {type: String},
 * Creator: {type: String},
 * Time: {type: Date (Creation date)},
 * Equations: [{type: String}],
 * Solution: [{type: String}],
 * Likes: [{type: String}],
 * Views: {type: Number}
 */
router.get('/api/viewProblems/newest', viewController.byTime);

/**
 * This is the like problem request. (It will toggle on and off the like)
 * No body.
 * params (path): problem id.
 * Result:
 * If worked status 200 with the message Liked problem/Removed like accordingly.
 * If didn't work status 500 with error couldn't like problem.
 */
router.put('/api/problem/:pid/like', authenticateToken, viewController.likeProblem);

/**
 * This is the comment on a problem request.
 * body: comment.
 * params (path): problem id.
 * Result:
 * If worked status 200 with the message commented problem.
 * If didn't work status 500 with error couldn't comment problem.
 */
router.post('/api/problem/:pid/comment', authenticateToken, viewController.commentProblem);

/**
 * This is the get problem by ID request.
 * No body.
 * params (path): problem id.
 * Result:
 * If worked status 200 with the message: Success and problem: [the problem with id pid].
 * If didn't work status 404 with error: couldn't find problem.
 */
router.get('/api/problem/:pid', viewController.getProblem);

module.exports = router;

