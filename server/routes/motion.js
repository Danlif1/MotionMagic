const problemController = require('../controllers/motion');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');


/**
 * This is the solve request.
 * Request body: {equations: [list of equations], _paths: [list of paths],
 * riders: [list of riders], riderData: [Map of riderData]}, isPublic: ["true" or "false"]
 * No params (path) data.
 * Example result:
 * for body: ["x+y+z=3", "y+z=3", "y=1"]
 * result = ['We will rearrange the equations:\nx+y+z=3\ny+z=3\ny=1\nTo the equations:\nx + y + z = 3\ny + z = 3\ny = 1\n', 'We will denote the equation: x + y + z = 3 as equation 1', 'We will denote the equation: y + z = 3 as equation 2', 'We will denote the equation: y = 1 as equation 3', 'Subtract equation 1 from equation 2 1.0 times', 'We will divide equation 2 by -1.0', 'Subtract equation 2 from equation 1 1.0 times', 'Subtract equation 3 from equation 1 1.0 times', 'We get that the solution is: {z: np.float64(2.0), x: np.float64(0.0), y: np.float64(1.0)}']
 */
router.post("/api/solve", authenticateToken, problemController.solveProblem);

/**
 * This is the history request.
 * No body, no params (path) data.
 * The result will be a list of problems with the structure:
 * ID: {type: String},
 * Creator: {type: String},
 * Time: {type: Date (Creation date)},
 * Equations: [{type: String}],
 * Solution: [{type: String}],
 * Likes: [{type: String}],
 * Views: {type: Number}
 */
router.get("/api/myProblems", authenticateToken, problemController.myProblems);

/**
 * This is get all liked problems request. (star and like are currently the same thing)
 * No body.
 * The result will be a list of problems with the structure:
 * ID: {type: String},
 * Creator: {type: String},
 * Time: {type: Date (Creation date)},
 * Equations: [{type: String}],
 * Solution: [{type: String}],
 * Likes: [{type: String}],
 * Views: {type: Number}
 */
router.get("/api/likedProblems", authenticateToken, problemController.likedProblems);

/**
 * This is the delete problem request.
 * No body,
 * Params (path) data: problem id.
 * The result will be status 200 if worked with message: Problem deleted successfully
 * Or: status 403 with the message: You are not the creator if didn't work.
 *
 */
router.delete("/api/deleteProblem/:pid", authenticateToken, problemController.deleteProblem);

/**
 * This is the save problem draft request.
 * Request body: _paths: [list of paths], riders: [list of riders],
 *                 riderData: [Map of riderData]}, equations: [list of equations]
 * No params (path) data.
 * The result will be status 200 if worked with message: Draft saved successfully
 * Or: status 500 with the message: Could not save draft.
 */
router.post("/api/saveDraft", authenticateToken, problemController.saveDraft);

/**
 * This is the delete draft request.
 * No body,
 * Params (path) data: draft id.
 * The result will be status 200 if worked with message: Draft deleted successfully
 * Or: status 403 with the message: You are not the creator if didn't work.
 *
 */
router.delete("/api/deleteDraft/:did", authenticateToken, problemController.deleteDraft);

module.exports = router;
