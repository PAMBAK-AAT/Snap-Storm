




const express = require("express");

const repoRouter = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // temporary folder for uploaded files

const repoController = require("../controllers/repoController");

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoryForCurrentUser);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepository);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);

repoRouter.post("/repo/:id/push", upload.single("file"), repoController.pushToRepository);
repoRouter.get("/repo/:id/file/:filename", repoController.getFileContentFromS3);



module.exports = repoRouter;