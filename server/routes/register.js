const registerController = require('../controllers/register');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Tokens
router.post('/api/tokens', registerController.generateToken);

// Users
router.get('/api/users/:username', authenticateToken, registerController.getUserByUsername);
router.post('/api/users', registerController.registerUser);

router.get('/*',registerController.redirectHome);

module.exports = router;

