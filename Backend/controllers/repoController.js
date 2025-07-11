

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

async function pushToRepository(req, res) {
    const { id } = req.params;
    const commitMessage = req.body.message;
    const file = req.file;

    if (!file || !commitMessage) {
        return res.status(400).json({ error: "File and message are required" });
    }

    try {
        const originalPath = path.join(process.cwd(), file.path);

        // 1. Add file to staging
        await addRepo(originalPath);

        // 2. Commit with message
        await commitRepo(commitMessage);

        // await Repository.findByIdAndUpdate(repoId, {
        //     $addToSet: { content: req.file.filename } // ✅ Prevents duplicates
        // });

        // 3. Push to S3
        await pushRepo();

        await fs.unlink(originalPath);

        res.status(200).json({ message: "File pushed successfully" });

    } catch (err) {
        console.error("Error pushing file:", err);
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

async function fetchRepositoryById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.find({ _id: id })
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
}