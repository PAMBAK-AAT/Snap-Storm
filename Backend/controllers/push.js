

const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

/**
 * Push a specific commit (folder) to S3 and clean up local folders after.
 * @param {string} commitId - UUID of the commit folder to upload.
 */
async function pushRepo(commitId) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitDir = path.join(repoPath, "commits", commitId);
  const stagingDir = path.join(repoPath, "stagings");

  try {
    const files = await fs.readdir(commitDir);

    for (const file of files) {
      const filePath = path.join(commitDir, file);
      const fileContent = await fs.readFile(filePath);

      const s3Key = `commits/${commitId}/${file}`;
      const params = {
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: fileContent,
      };

      await s3.upload(params).promise();
    }

    // ✅ Delete the local commit folder after successful push
    await fs.rm(commitDir, { recursive: true, force: true });

    // ✅ Delete the entire staging folder (optional)
    await fs.rm(stagingDir, { recursive: true, force: true });

  } catch (err) {
    console.error(`❌ Error pushing commit ${commitId} to S3:`, err.message);
    throw err;
  }
}

module.exports = { pushRepo };
