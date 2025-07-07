

// What Your Code Does:

// Reads all commit directories from apnaGit/commits/.
// Iterates through each commit folder.
// Reads all files inside each commit folder.
// Uploads each file to the S3 bucket under commits/{commitDir}/{file}.
// Logs success messages after uploading each commit.
// Catches and logs any errors.


const fs = require("fs").promises; // Use promises version of fs for async/await
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
    // Get absolute path of the repository
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits"); // Path to commits directory

    try {
        // Read all commit folders inside the "commits" directory
        const commitDirs = await fs.readdir(commitsPath);

        for (const commitDir of commitDirs) { 
            const commitPath = path.join(commitsPath, commitDir); // Path to each commit folder
            const files = await fs.readdir(commitPath); // Get all files inside the commit folder

            for (const file of files) {
                const filePath = path.join(commitPath, file); // Get full path of each file
                const fileContent = await fs.readFile(filePath); // Read file content

                // Define S3 upload parameters
                const params = {
                    Bucket: S3_BUCKET, // S3 bucket name
                    Key: `commits/${commitDir}/${file}`, // Object key in S3
                    Body: fileContent, // File content to upload
                };

                // Upload the file to S3
                await s3.upload(params).promise();
            }

            console.log(`Successfully pushed commit: ${commitDir} to S3.`);
        }
    } catch (err) {
        console.error("Error in pushing commits to S3 bucket: ", err);
    }
}

module.exports = { pushRepo };
