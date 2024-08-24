const registerService = require('../services/register');

const {join} = require("path");

async function getUserByUsername(req, res) {
    const user = await registerService.getUserByUsername(req.params.username, req.user.username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
}

async function redirectHome(req, res) {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
}

async function registerUser(req, res) {
    const user = await registerService.registerUser(req.body.Username,
                                                                 req.body.DisplayName,
                                                                 req.body.Password,
                                                                 req.body.ProfilePicture);
    if (!user) {
        return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(200).json({ message: 'Success' });
}

async function generateToken(req, res) {
    const token = await registerService.generateToken(req.body);
    if (!token) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    res.send(token);
}

module.exports = {
    getUserByUsername,
    registerUser,
    redirectHome,
    generateToken
};