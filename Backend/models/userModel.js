

const mongoose = require("mongoose");
const { Schema } = mongoose; // It is used to create a schema for our model

// Define the schema for a file commit
const UserSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    repositories: [
        {
            default: [],
            type: Schema.Types.ObjectId, // It is going to point out the repo model 
            ref: "Repository",
        }
    ],
    followedUsers: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    starRepos: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository",
        }
    ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;









