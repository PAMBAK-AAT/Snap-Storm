
const express = require("express");

const issueRouter = express.Router();

const issueController = require("../controllers/issueController");

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueByID);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);



module.exports = issueRouter;
