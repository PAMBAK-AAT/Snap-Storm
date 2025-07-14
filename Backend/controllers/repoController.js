
// ====== 📁 BACKEND: pushToRepository Controller ======

const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const connectMongoose = require("../config/db");

const path = require("path");
const fs = require("fs").promises;
const { addRepo } = require("./add");
const { commitRepo } = require("./commit");
const { pushRepo } = require("./push");


const { s3, S3_BUCKET } = require("../config/aws-config");


// GET /repo/:id/file/:filename

async function fetchRepositoryById(req, res) {
    const { id } = req.params;
    try {

        const repository = await Repository.findOne({ _id: id }).populate("owner").populate("issues");
        if (!repository) {
            return res.status(404).json({ message: "Repository not found." });
        }
        res.status(200).json(repository);

    } catch (err) {
        console.error("Error fetching repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}
async function getFileContentFromS3(req, res) {
    const { id, filename } = req.params;
    const { commit } = req.query; // ✅ Optional commit ID

    try {
        const repo = await Repository.findById(id);
        if (!repo) return res.status(404).json({ error: "Repository not found" });

        let fileObj;

        if (commit) {
            // ✅ Find exact match for commit version
            fileObj = repo.content.find(
                (f) => f.originalName === filename && f.commitId === commit
            );
        } else {
            // ✅ Get latest version if no commit specified
            const allVersions = repo.content.filter((f) => f.originalName === filename);
            if (allVersions.length === 0) {
                return res.status(404).json({ error: "File not found in metadata" });
            }

            fileObj = allVersions.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            )[0]; // latest
        }

        if (!fileObj) {
            return res.status(404).json({ error: "File version not found." });
        }

        const s3Key = `commits/${fileObj.commitId}/${fileObj.storedName}`;
        const params = {
            Bucket: S3_BUCKET,
            Key: s3Key,
        };

        const data = await s3.getObject(params).promise();

        // 🔍 Fetch commit message
        const commitJsonKey = `commits/${fileObj.commitId}/commit.json`;
        const commitData = await s3.getObject({
            Bucket: S3_BUCKET,
            Key: commitJsonKey,
        }).promise();

        const commitMessage = JSON.parse(commitData.Body.toString("utf-8")).message;

        res.status(200).json({
            fileContent: data.Body.toString("utf-8"),
            commitMessage,
        });
    } catch (err) {
        console.error("❌ Error fetching file from S3:", err.code || err.message);
        if (err.code === "NoSuchKey") {
            return res.status(404).json({ error: "File not found in S3" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}



async function pushToRepository(req, res) {

    const { id } = req.params;
    const commitMessage = req.body.message;
    const file = req.file;

    if (!file || !commitMessage) {
        return res.status(400).json({ error: "File and message are required" });
    }

    try {
        const originalPath = path.join(process.cwd(), file.path);

        // 1. Add to staging
        await addRepo(originalPath);

        // 2. Commit and get commit ID
        const latestCommitId = await commitRepo(commitMessage); // ✅ get commitId

        // 3. Push to S3
        await pushRepo(latestCommitId);
        
        // 4. Update DB with file metadata
        await Repository.findByIdAndUpdate(id, {
            $push: {
                content: {
                    originalName: file.originalname,
                    storedName: file.filename,
                    commitId: latestCommitId,
                    date: new Date(),
                },
            },
        });



        // 5. Cleanup
        await fs.unlink(originalPath);


        res.status(200).json({ message: "✅ File pushed successfully and repo updated." });
    } catch (err) {
        console.error("❌ Error pushing file:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



async function createRepository(req, res) {

    const { name, description, content, visibility, owner, issues } = req.body;

    try {

        await connectMongoose();

        if (!name) {
            return res.status(400).json({ error: "Repository name is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid owner ID" });
        }

        const newRepository = new Repository({
            name,
            description,
            content: content || [],
            visibility: visibility || false, // default to private if not specified
            owner,
            issues: issues || []
        });

        const result = await newRepository.save();

        // // 2. Push the repo _id into the user's repositories array
        // await User.findByIdAndUpdate(
        //     owner,
        //     { $push: { repositories: result._id } },
        //     { new: true }
        // );

        res.status(201).json({
            message: "Repository created successfully",
            repositoryID: result._id,
        });

    } catch (err) {
        console.error("Error creating repository:", err.message);
        res.status(500).send("Internal Server Error");
    }
}


async function getAllRepository(req, res) {

    try {

        const repositories = await Repository.find({}).populate("owner").populate("issues");

        if (repositories.length === 0) {
            return res.status(404).json({ message: "No public repositories found." });
        }

        res.status(200).json(repositories);
    } catch (err) {
        console.error("Error fetching repositories:", err.message);
        res.status(500).send("Internal Server Error");
    }
}


async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
    try {
        const repository = await Repository.find({ name })
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ message: "Repository not found." });
        }

        res.status(200).json(repository);
    } catch (err) {
        console.error("Error fetching repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}


// Now all these functions can only be accessed by the user if he is logged in
async function fetchRepositoryForCurrentUser(req, res) {
    const userId = req.params.userId;

    try {
        const repositories = await Repository.find({ owner: userId });
        if (!repositories || repositories.length === 0) {
            return res.status(404).json({ message: "No repositories found for this user." });
        }

        res.json({ message: "Repositories found successfully", repositories });

    } catch (err) {
        console.error("Error fetching repositories for user:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found." });
        }

        repository.content.push(content);
        repository.description = description || repository.description; // Update description if provided

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository
        });

    } catch (err) {
        console.error("Error updating repository:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function toggleVisibilityById(req, res) {
    const { id } = req.params;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found." });
        }

        repository.visibility = !repository.visibility; // Toggle visibility

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository toggled visibility successfully",
            repository: updatedRepository
        });

    } catch (err) {
        console.error("Error in toggle the visibility:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteRepository(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found." });
        }

        res.json({ message: "Repository deleted successfully." });
    } catch (err) {
        console.error("Error deleting repository:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteFileVersion(req, res) {
    const { repoId, filename, commitId } = req.params;

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        // Find the specific file object
        const fileToDelete = repo.content.find(
            (file) => file.originalName === filename && file.commitId === commitId
        );

        if (!fileToDelete) {
            return res.status(404).json({ error: "File/commit not found" });
        }

        // 1️⃣ Delete the file from S3
        const fileKey = `commits/${commitId}/${fileToDelete.storedName}`;
        const commitJsonKey = `commits/${commitId}/commit.json`;

        await s3.deleteObject({ Bucket: S3_BUCKET, Key: fileKey }).promise();
        await s3.deleteObject({ Bucket: S3_BUCKET, Key: commitJsonKey }).promise();

        // 2️⃣ Remove the file metadata from the repository content
        repo.content = repo.content.filter(
            (file) => !(file.originalName === filename && file.commitId === commitId)
        );

        await repo.save();

        res.status(200).json({ message: "File version deleted successfully." });
    } catch (error) {
        console.error("❌ Failed to delete file version:", error.message || error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// deleteRepository, toggleVisibilityById, updateRepositoryById, fetchRepositoryForCurrentUser, createRepository -> All these are Authenticated routes
// getAllRepository, fetchRepositoryById, fetchRepositoryByName -> These routes can beaccessed by everyone provided that the repo should be public.


module.exports = {
    deleteRepository,
    toggleVisibilityById,
    updateRepositoryById,
    fetchRepositoryForCurrentUser,
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    pushToRepository,
    getFileContentFromS3,
    deleteFileVersion
}