

const path = require("path");
const fs = require("fs").promises;
const {v4: uuidv4} = require("uuid"); // Here we use version 4 of uuid package to generate Id faster and so fetching also becomes easy
// we can also use v5 version for our extra security...

async function commitRepo(message){

    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitPath = path.join(repoPath, "commits");
    const stagedPath = path.join(repoPath, "staging");

    try {
        const commitID =uuidv4();
        const commitDir = path.join(commitPath, commitID); // here our commit path is upto the commits folder, and here we generate another folder path with the commitId name
        await fs.mkdir(commitDir, {recursive : true});
        const files = await fs.readdir(stagedPath); // It will read all the files that are present  int the staging area.
        for(const file of files){
            await fs.copyFile(
                path.join(stagedPath, file), // Initial path where file present
                path.join(commitDir, file) // final path where we need to move the file
                // Here we put same name to the file that we store in commitDir, so that during revert it just replaces.
            );
        }

        // When we create a file then we give two things where we are creating the file, and the file name
        // JSON.stringify -> It converts 
        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() }) // here our JS object that we have provided is going to convert into JSON form string
            // thus our current time stamp with the given message will be stored in form of JSON in our commit.json file
        );

        console.log(`Commit -> ${commitID} , successfully created with message -> ${message} `);
        
    } catch (error) {
        console.error("Error in commiting the file in the commits folder.")
    }
}

module.exports = {commitRepo};


