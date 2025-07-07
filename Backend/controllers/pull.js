

// What This Code Does:

// Gets a list of all commit files stored in the S3 bucket under "commits/".
// Iterates through each file and:
// Extracts its commit folder name.
// Creates the commit folder locally (.apnaGit/commits/).
// Fetches the file from S3.
// Writes the file in the correct directory.
// Logs success messages.
// Handles errors properly.


const fs = require("fs").promises; // Use promises-based fs methods
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {

    // Define the local repository path where commits will be stored
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits"); // Path where commit folders will be created

    try {
        // Fetch all objects (files) from S3 with "commits/" prefix
        const data = await s3.listObjectsV2({ 
            Bucket: S3_BUCKET,  // The S3 bucket name
            Prefix: "commits",  // Filter to only get objects starting with "commits/"
        }).promise(); // Ensure we get a Promise-based response

        const objects = data.Contents; // List of all objects (files) in the S3 bucket

        for (const object of objects) {
            
            const key = object.Key; // Get the file path in S3 (e.g., commits/commit1/file.txt)
            
            // Extract the commit folder name from the key (e.g., "commit1")
            const commitDir = path.join(commitsPath, path.dirname(key).split("/").pop());
            
            // Create commit directory if it doesn't exist
            await fs.mkdir(commitDir, { recursive: true }); 

            // Define parameters for fetching the file from S3
            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            };

            // Calls AWS S3 to fetch a file using the params object (which contains Bucket and Key).
            const fileContent = await s3.getObject(params).promise(); 
            
            // Write the file to the local repository, keeping the same structure as in S3
            await fs.writeFile(path.join(repoPath, key), fileContent.Body);

            console.log(`✅ Commit file pulled from S3: ${key}`);
        }
    } catch (err) {
        console.error("❌ Error in pulling files from S3 bucket:", err);
    }
}

module.exports = { pullRepo };
