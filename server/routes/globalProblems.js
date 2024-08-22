const viewController = require('../controllers/globalProblems');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');


router.get('/api/viewProblems/mostLikes', authenticateToken, viewController.byMostLikes);
router.get('/api/viewProblems/newest', authenticateToken, viewController.byTime);

router.put('/api/problem/:pid/like', authenticateToken, viewController.likeProblem);


module.exports = router;

