


const mongoose = require("mongoose");
const { Schema } = mongoose;


const RepositorySchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
    content: [
        {
            originalName: String,
            storedName: String,
            commitId: String, // (optional but useful)
            date: { type: Date, default: Date.now }
        }
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue",
        }
    ],

}, { collection: "repositories" });

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;

