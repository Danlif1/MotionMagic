const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get the token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ error: 'Access token not found' });
    }

    try {
        const key = 'your-secret-key'
        // Verify the token and attach it to the request object
        req.user = jwt.verify(token, key);

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Token verification failed
        return res.status(403).json({ error: 'Invalid token' });
    }
}

module.exports = authenticateToken;

