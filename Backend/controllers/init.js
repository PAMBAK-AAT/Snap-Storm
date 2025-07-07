

const fs = require("fs").promises;
const path = require("path"); // it provides us the current working directory path...

// Here we use async function, because folder creation is a time consuming process and 
// we use try and catch block because we don't know either folder creation will be successful or not...

async function initRepo(){
    
    const repoPath = path.resolve(process.cwd(), ".apnaGit"); // It creates a path  where later on .apnaGit folder will be created
    //// It's a hidden folder so we don't need  to make commit folder as a hidden folder.
    const commitsPath = path.join(repoPath, "commits"); // It creates a path for commits where later on commit folder will be created

    try {
        // here we mark true to the recursive, so that if one folder exist then we can also make another folder in it...
        await fs.mkdir(repoPath, {recursive : true}); 
        await fs.mkdir(commitsPath, {recursive : true});
        // This is used to write the file.
        await fs.writeFile(
            path.join(repoPath, "config.json"), // here in this file we store the latest message of any file that we commit 
            JSON.stringify( {bucket : process.env.S3_bucket}) // This converts an object containing an environment variable (S3_bucket) into a JSON string. 
            // process.env holds environment variables in Node.js. S3_bucket is an environment variable that stores the name of an AWS S3 bucket.
        );
        console.log("Repository Initialised...");
    } catch (error) {
        console.log("Error in initialising the repo", error);
    }

}

// .apnaGit/	Main repository folder (like .git/) that stores and track of all changes
// commits/	Stores previous versions of all commits or files (commits) with unique commit Id
// config.json ->	Stores settings like remote repo info

module.exports = { initRepo };

