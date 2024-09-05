const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    ID: {
        type: Number,
        integer: true
    },
    Created: {
        type: Date,
        default: Date.now
    },
    Creator:{
        type: String,
        required:true
    },
    CreatorImg: {
        type: String,
        required: true
    },
    Content: {
        type: String,
        required: true
    }
});

const ProblemSchema = new Schema({
    ID: {
        type: String,
        //required: true, Creates bugs on windows.
        //unique: true
        nullable:true
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
    },
    Comments: [{
        type: CommentSchema,
        nullable: true
    }]
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
const Comment = mongoose.model('Comment', CommentSchema)


module.exports = { User, Problem, Comment };