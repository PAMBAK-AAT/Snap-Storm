

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for a file commit
const FileCommitSchema = new Schema({
  originalName: {
    type: String,
    required: true,
  },
  storedName: {
    type: String,
    required: true,
  },
  commitId: {
    type: String,
    required: true,
  },
  message: {
    type: String, // ✅ Optional commit message per file
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const RepositorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: [FileCommitSchema], // ✅ Embedded schema for better clarity
  visibility: {
    type: Boolean,
    default: false,
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
}, { 
  collection: "repositories", 
  timestamps: true // ✅ adds createdAt and updatedAt fields
});

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;

