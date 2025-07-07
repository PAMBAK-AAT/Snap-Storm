


const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    repository: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Repository",
    },
    status: {
        type: String,
        enum: ["open", "closed"], // you have to choose any one option from there,
        default: "open",
    }
});

const Issue = mongoose.model("Issue", IssueSchema);
export default Issue;




