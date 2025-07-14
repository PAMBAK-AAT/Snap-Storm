

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { Dialog } from "@headlessui/react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [repositories, setRepositories] = useState([]);
  const [expandedRepoId, setExpandedRepoId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeFileView, setActiveFileView] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const fetchUserDetails = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userProfile/${userId}`);
      setUserDetails(res.data);

      const repoRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/repo/user/${userId}`);
      setRepositories(repoRes.data.repositories || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { type, repoId, filename, commitId } = deleteTarget;

    try {
      if (type === "repo") {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/repo/delete/${repoId}`);
      } else if (type === "file") {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/repo/${repoId}/file/${filename}/${commitId}`);
      }
      fetchUserDetails();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleFileClick = async (repoId, filename, commitId) => {
    if (
      activeFileView &&
      activeFileView.repoId === repoId &&
      activeFileView.filename === filename &&
      activeFileView.commitId === commitId
    ) {
      setActiveFileView(null);
      return;
    }

    setFileLoading(true);
    setFileContent("");
    setCommitMessage("");
    setActiveFileView({ repoId, filename, commitId });

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repo/${repoId}/file/${filename}?commit=${commitId}`
      );
      setFileContent(res.data.fileContent);
      setCommitMessage(res.data.commitMessage);
    } catch (err) {
      setFileContent("❌ Error loading content.");
      setCommitMessage("");
    } finally {
      setFileLoading(false);
    }
  };

  const groupedByFile = (repo) => {
    const files = {};
    repo.content.forEach((f) => {
      if (!files[f.originalName]) files[f.originalName] = [];
      files[f.originalName].push(f);
    });
    return files;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl border-4 border-white mb-4" />
            <h3 className="text-2xl font-semibold text-cyan-300">{userDetails.username}</h3>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-gray-900 p-6 rounded-xl shadow-inner border border-white/10">
              <HeatMapProfile />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Repositories</h2>

          {repositories.map((repo) => {
            const isExpanded = expandedRepoId === repo._id;
            const files = groupedByFile(repo);

            return (
              <div key={repo._id} className="bg-white/10 rounded-xl mb-6 p-4 border border-white/20">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedRepoId(isExpanded ? null : repo._id)}>
                  <h3 className="text-xl font-bold text-blue-300">📁 {repo.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ type: "repo", repoId: repo._id });
                      setShowConfirm(true);
                    }}
                    className="text-red-400 cursor-pointer hover:text-red-600 text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    {Object.entries(files).map(([filename, versions]) => (
                      <div key={filename} className="mb-4 bg-black/30 rounded-xl p-4">
                        <h4 className="text-lg font-semibold text-cyan-300 mb-2">📄 {filename}</h4>
                        {versions.map((file) => (
                          <div key={file.commitId} className="bg-gray-800 p-3 rounded-lg mb-2">
                            <div className="flex justify-between items-center">
                              <div
                                onClick={() =>
                                  handleFileClick(repo._id, filename, file.commitId)
                                }
                                className="cursor-pointer"
                              >
                                <p className="text-sm text-white">🕓 {new Date(file.date).toLocaleString()}</p>
                                <p className="text-sm text-gray-400">🔐 Commit ID: {file.commitId.slice(0, 6)}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setDeleteTarget({ type: "file", repoId: repo._id, filename, commitId: file.commitId });
                                  setShowConfirm(true);
                                }}
                                className="text-red-400 cursor-pointer hover:text-red-600 text-sm"
                              >
                                🗑 Delete
                              </button>
                            </div>

                            {activeFileView &&
                              activeFileView.repoId === repo._id &&
                              activeFileView.filename === filename &&
                              activeFileView.commitId === file.commitId && (
                                <div className="mt-4 bg-black/40 p-4 rounded-lg border border-white/10">
                                  <p className="text-fuchsia-300 text-sm italic mb-2">
                                    💬 {commitMessage || "No commit message"}
                                  </p>
                                  <pre className="whitespace-pre-wrap text-sm text-gray-200 max-h-60 overflow-auto">
                                    {fileLoading ? "⏳ Loading..." : fileContent}
                                  </pre>
                                  <button
                                    onClick={() => setActiveFileView(null)}
                                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
                                  >
                                    ❌ Close
                                  </button>
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
          className="cursor-pointer fixed bottom-6 right-6 px-5 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition"
        >
          Logout
        </button>
      </div>

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Panel className="bg-gray-800 p-6 rounded-xl text-white max-w-sm w-full shadow-xl border border-white/20">
            <Dialog.Title className="text-lg font-bold text-red-400 mb-4">Are you sure?</Dialog.Title>
            <p className="text-sm mb-6">This action cannot be undone. Do you want to delete this {deleteTarget?.type}?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 cursor-pointer py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 cursor-pointer bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Profile;
