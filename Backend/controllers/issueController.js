

const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");


async function createIssue  (req, res) {
    
    const {title, description} = req.body;
    const { id } = req.params; // Assuming the repository ID is passed in the URL

    try{

        const issue = new Issue({
            title,
            description,
            repository: id, // Link the issue to the repository
        });
    
        await issue.save();
    
        res.status(202).json(issue);
    }catch(err){
        console.error("Error creating issue:", err.message);
        res.status(500).send("Internal Server Error");
    }
}


async function updateIssueById (req, res) {
    const { id } = req.params; // Assuming the issue ID is passed in the URL
    const { title, description, status } = req.body;
    try{
        const issue = await Issue.findById(id);
        if(!issue) {
            return res.status(404).json({ message: "Issue not found." });
        }
        
        issue.title = title || issue.title;
        issue.description = description || issue.description;
        issue.status = status || issue.status;
        
        await issue.save();
        
        res.json({message: "Issue updated successfully", issue});
        
    }catch(err){
        console.error("Error updating issue:", err.message);
        return res.status(500).send("Internal Server Error");
    }
}

async function deleteIssueById (req, res) {
    const {id} = req.params; // Assuming the issue ID is passed in the URL
    try{
        const issue = await Issue.findByIdAndDelete(id);
        
        if(!issue){
            return res.status(404).json({ message: "Issue not found." });
        }
        res.json({ message: "Issue deleted successfully", issue });
        
    }catch(err){
        console.error("Error deleting issue:", err.message);
        return res.status(500).send("Internal Server Error");
    }
}

const getAllIssues = (req, res) => {
   const { id } = req.params; // Assuming the repository ID is passed in the URL

   try{
        const issues = Issue.find({ repository: id });
        if(!issues) {
            return res.status(404).json({ message: "No issues found for this repository." });
        }
        res.status(200).json(issues);
   }catch(err){
        console.error("Error fetching issues:", err.message);
        return res.status(500).send("Internal Server Error");
   }

}

const getIssueByID = (req, res) => {
    const { id } = req.params; // Assuming the issue ID is passed in the URL
    try{
        const issue = Issue.findById(id).populate("repository");
        if(!issue) {
            return res.status(404).json({ message: "Issue not found." });
        }
        res.status(200).json(issue);
    }catch(err){
        console.error("Error fetching issue:", err.message);
        return res.status(500).send("Internal Server Error");
    }
}


module.exports = {

    getAllIssues,
    getIssueByID,
    updateIssueById,
    deleteIssueById,
    createIssue,
}
