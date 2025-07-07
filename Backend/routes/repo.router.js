




const express = require("express");

const repoRouter = express.Router();

const repoController = require("../controllers/repoController");

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/:userID", repoController.fetchRepositoryForCurrentUser);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepository);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);


module.exports = repoRouter;