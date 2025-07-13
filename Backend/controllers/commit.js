


const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

// async function commitRepo(message) {
//   const repoPath = path.resolve(process.cwd(), ".apnaGit");
//   const commitPath = path.join(repoPath, "commits");
//   const stagedPath = path.join(repoPath, "staging");

//   try {
//     const commitID = uuidv4();
//     const commitDir = path.join(commitPath, commitID);
//     await fs.mkdir(commitDir, { recursive: true });

//     const files = await fs.readdir(stagedPath);
//     for (const file of files) {
//       await fs.copyFile(
//         path.join(stagedPath, file),
//         path.join(commitDir, file)
//       );
//     }

//     await fs.writeFile(
//       path.join(commitDir, "commit.json"),
//       JSON.stringify({ message, date: new Date().toISOString() })
//     );

//     console.log(`✅ Commit -> ${commitID} , successfully created with message -> ${message}`);
//     return commitID; // ✅ RETURN commit ID for usage in DB
//   } catch (error) {
//     console.error("❌ Error in committing the file in the commits folder.");
//     throw error; // Re-throw so caller knows it failed
//   }
// }

async function commitRepo(message, repoId) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitPath = path.join(repoPath, "commits");
  const stagedPath = path.join(repoPath, "staging");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);

    for (const file of files) {
      const fileData = await fs.readFile(path.join(stagedPath, file));
      await fs.writeFile(path.join(commitDir, file), fileData);
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );

    console.log(`✅ Commit -> ${commitID} , successfully created with message -> ${message}`);
    return commitID;
  } catch (error) {
    console.error("❌ Error in committing the file in the commits folder.", error);
    throw error;
  }
}

module.exports = { commitRepo };
