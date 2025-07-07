

const createIssue = (req, res) => {
    res.send("Issue Created !");
}

const getAllIssues = (req, res) => {
    res.send("fetched all issues!");
}

const getIssueByID = (req, res) => {
    res.send("That User issue fetched.");
}

const updateIssue = (req, res) => {
    res.send("Issue updated !");
}

const deleteIssue = (req, res) => {
    res.send("Issue deleted !");
}

module.exports = {

    getAllIssues,
    getIssueByID,
    updateIssue,
    deleteIssue,
    createIssue,
}
