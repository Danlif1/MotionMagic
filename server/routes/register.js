const registerController = require('../controllers/register');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Tokens
/**
 * login request (Will generate token for user)
 * In body: username and password.
 * Result: token if correct.
 * error 404 if incorrect.
 */
router.post('/api/tokens', registerController.generateToken);

// Users
/**
 * Get all user data.
 * In params: username.
 * Result: status 200 with user if ok.
 * status 404 if not ok.
 */
router.get('/api/users/:username', authenticateToken, registerController.getUserByUsername);

/**
 * Register user request.
 * Body: Username, DisplayName, Password, ProfilePicture.
 * Result: status 200 with user if ok.
 * status 409 if not ok.
 */
router.post('/api/users', registerController.registerUser);

/**
 * Redirect home request (main page)
 * No body, no headers, no params.
 */
router.get('/*',registerController.redirectHome);

module.exports = router;

