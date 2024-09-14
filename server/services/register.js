const {User} = require('../models/motion');
const mongoose = require("mongoose");
const {logErrorToFile, logActionToFile, logForbiddenToFile, logInternalErrorToFile} = require('../middleware/logger.js');
const jwt = require("jsonwebtoken");
const customEnv = require('custom-env');

customEnv.env(process.env.NODE_ENV, './config'); // Load environment variables from a custom file

async function getUserByUsername(username, hUsername) {
    if (hUsername && (username !== hUsername)) {
        logForbiddenToFile("User: " + hUsername + " tried accessing user: " + username);
        return null;
    }
    const user = await User.findOne({ Username: username });
    if (!user) {
        logErrorToFile("Fake user: " + username + " tried accessing its data");
        return null;
    }
    logActionToFile("User: " + username + " accessed his data");
    return user;
}

async function registerUser(username, displayName, password, profilePicture) {
    if (!username || !password || !displayName) {
        logErrorToFile("User tried registering without username")
        return null;
    }
    const userByName = await User.findOne({ Username: username });
    if (userByName) {
        logErrorToFile("User tried registering with username that already exists: " + username);
        return null;
    }
    logActionToFile("User: " + username + " registered");
    const newUser = await new User({
        Username: username,
        Password: password,
        DisplayName: displayName,
        ProfilePicture: profilePicture,
        Problems: [],
        LikedProblems: [],
        Drafts: []
    });
    await newUser.save();
    return true;
}

async function generateToken(user) {
    const {username, password} = user;

    const existingUser = await User.findOne({Username: username, Password: password});
    if (!existingUser) {
        logErrorToFile("Fake user: " + username + " tried generating token")
        return null;
    }
    const payload = {username: username};
    const secretKey = process.env.SECRET_KEY;
    logActionToFile("User: " + username + " generated token");
    return jwt.sign(payload, secretKey);
}

module.exports = {
    getUserByUsername,
    registerUser,
    generateToken
};