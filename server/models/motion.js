const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProblemSchema = new Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    },
    Creator: {
        type: String,
        required: true
    },
    Time: {
        type: Date,
        default: Date.now()
    },
    Equations: [{
        type: String,
        nullable: true
    }],
    Solution: [{
        type: String,
        nullable: true
    }],
    Likes: [{
        type: String,
        nullable: true
    }],
    Views: {
        type: Number,
        default: 0
    }
})

const UserSchema = new Schema({
    Username: {
        type: String,
        required: true,
        unique: true
    },
    DisplayName: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        require: true
    },
    ProfilePicture: {
        type: String,
        nullable: true
    },
    Problems: [{
        type: ProblemSchema,
        nullable: true
    }],
    starredProblems: [{
        type: ProblemSchema,
        nullable: true
    }]
})

const User = mongoose.model('User', UserSchema);
const Problem = mongoose.model('Problem', ProblemSchema);



module.exports = { User, Problem };