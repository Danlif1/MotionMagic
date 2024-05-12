function errorHandler(err, req, res, next) {
    console.error(err);

    // Handle different types of errors and return appropriate responses
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    // Handle other types of errors

    // Default error response
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
