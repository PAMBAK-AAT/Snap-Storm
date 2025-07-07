

const express = require("express");

const useRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router")


const mainRouter = express.Router();

// Here we connect our all router to a single main router of this application...
mainRouter.use(useRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get( "/" ,(req, res) => {
    res.send("إن شاءالله,  ٱلسَّلَامُ عَلَيْكُمْ,  محمد إرشاد,  ٱلْحَمْدُ لِلَّٰهِ");
})

module.exports = mainRouter;
















