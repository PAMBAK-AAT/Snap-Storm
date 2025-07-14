
const path = require("path");
const fs = require("fs").promises;

async function addRepo(filePath){

    const repoPath = path.resolve(process.cwd(), ".apnaGit"); 
    const stagingPath = path.join(repoPath, "staging");

    try {

        await fs.mkdir(stagingPath, {recursive: true});
        const fileName = path.basename(filePath); // here we extract the name of the file from the filePath that is provided by the user...
        await fs.copyFile(filePath, path.join(stagingPath, fileName))
        // console.log(`File ${fileName} added in the staging folder.`)

    } catch (error) {
        
        console.error("Error in staging the file in staged area");
    }
    
}

module.exports = {addRepo};