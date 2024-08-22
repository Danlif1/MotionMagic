const problemController = require('../controllers/motion');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.post("/api/solve", authenticateToken, problemController.solveProblem);

router.get("/api/myProblems", authenticateToken, problemController.myProblems);
router.get("/api/starredProblems", authenticateToken, problemController.starredProblems);

router.delete("/api/deleteProblem/:pid", authenticateToken, problemController.deleteProblem);


module.exports = router;
