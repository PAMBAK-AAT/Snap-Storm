

/// Authentication -> They have valid credentials. (Already have an account and login)
/// Authorization -> They have access to perform the relevant action, (who can edit , and who can delete)

// here we tell to the computer that we have a file in past in our backend folder but now it is not present,
// so try to revert it by using the folder name(commitID) present in the commits folder using ->
// node index.js revert 4a54bed0-68be-458e-a14d-269ec53bf86f


const fs = require("fs");
const path = require("path");
const { promisify } = require("util"); // promisify is a utility function provided by Node.js that converts a callback-based function into a Promise-based one.

// Convert callback-based functions to Promise-based functions
const readdir = promisify(fs.readdir); // Reads all files in a directory
const copyFile = promisify(fs.copyFile); // Copies a file from source to destination

async function revertRepo(commitID) {
    
    // Define the repository path and the commits folder path
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        // Get the commit directory where the required commit files are stored
        const commitDir = path.join(commitsPath, commitID);

        // Read all files present in the given commit folder
        const files = await readdir(commitDir);

        // Get the parent directory of `.apnaGit`, where the repo files should be restored
        const parentDir = path.join(repoPath, ".."); // Move one folder back

        // Copy each file from the commit directory to the original repository location
        for (const file of files) {
            const source = path.join(commitDir, file);
            const destination = path.join(parentDir, file);
            await copyFile(source, destination);
        }

        console.log(`✅ Successfully reverted to commit: ${commitID}`);
    } catch (err) {
        console.error("❌ Sorry, unable to revert your directory:", err);
    }
}

module.exports = { revertRepo };
