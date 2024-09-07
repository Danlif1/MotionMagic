const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    ID: {
        type: String,
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

const RiderSchema = new Schema({
    Name: {
        type: String
    },
    Paths: [{
        type: String,
        nullable: true
    }]
})

const RiderDataSchema = new Schema({
    Path: {
        type: String
    },
    Time: {
        type: String
    },
    Velocity: {
        type: String
    },
    Distance: {
        type: String
    }
})

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
    CreatorUsername: {
        type: String,
        required: true
    },
    CreatorProfilePic: {
        type: String,
        nullable: true
    },
    Time: {
        type: Date,
        default: Date.now()
    },
    Equations: [{
        type: String,
        nullable: true
    }],
    Paths: [{
        type: String,
        nullable: true
    }],
    Riders: [{
        type: RiderSchema,
        nullable: true
    }],
    RidersData: {
        type: Map,
        of: [RiderDataSchema]
    },
    Solution: [[{ // The full solution
        type: String,
        nullable: true
    }], { // The final solution
        type: String,
        nullable: true
    }],
    Likes: [{
        type: String,
        nullable: true
    }],
    Viewers: [{
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
    }],
    Public: {
        type: Boolean,
        default: false
    }
})

const DraftSchema = new Schema({
    ID: {
        type: String,
        nullable:true
    },
    Creator: {
        type: String,
        required: true
    },
    CreatorUsername: {
        type: String,
        required: true
    },
    CreatorProfilePic: {
        type: String,
        nullable: true
    },
    Time: {
        type: Date,
        default: Date.now()
    },
    Equations: [{
        type: String,
        nullable: true
    }],
    Paths: [{
        type: String,
        nullable: true
    }],
    Riders: [{
        type: RiderSchema,
        nullable: true
    }],
    RidersData: {
        type: Map,
        of: [RiderDataSchema]
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
    LikedProblems: [{
        type: ProblemSchema,
        nullable: true
    }],
    Drafts: [{
        type: DraftSchema,
        nullable: true
    }]
})

const User = mongoose.model('User', UserSchema);
const Problem = mongoose.model('Problem', ProblemSchema);
const Draft = mongoose.model('Draft', DraftSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Rider = mongoose.model('Rider', RiderSchema);
const RiderData = mongoose.model('RiderData', RiderDataSchema);


module.exports = { User, Problem, Draft, Comment, Rider, RiderData };