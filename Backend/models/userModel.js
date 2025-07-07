

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({

    username:{
        type: string,
        required: true,
        unique: true,
    },
    email: {
        type: string,
        required: true,
        unique: true,
    },
    password: {
        type: string,
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

export default User;









