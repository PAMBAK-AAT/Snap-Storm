


const createRepository = (req, res) => {
    res.send("Repository created!");
}

// 
const getAllRepository = (req, res) => {
    res.send("All Repository fetched!");
}

const fetchRepositoryById = (req, res) => {
    res.send("Repository details fetched!");
}

const fetchRepositoryByName = (req, res) => {
    res.send("Repo details fetched by name !");
}

const fetchRepositoryForCurrentUser = (req, res) => {
    res.send("Repo for logged In user has been fetched!");
}

const updateRepositoryById = (req, res) => {
    res.send("Repo updated !");
}

const toggleVisibilityById = (req, res) => {
    res.send("Visibility Toggled !");
}

const deleteRepository = (req, res) => {
    res.send("Repository deleted!");
}

// deleteRepository, toggleVisibilityById, updateRepositoryById, fetchRepositoryForCurrentUser, createRepository -> All these are Authenticated routes
// getAllRepository, fetchRepositoryById, fetchRepositoryByName -> These routes can beaccessed by everyone provided that the repo should be public.


module.exports = {
    deleteRepository,
    toggleVisibilityById,
    updateRepositoryById,
    fetchRepositoryForCurrentUser,
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
}