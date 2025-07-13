// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../Navbar";
// import HeatMapProfile from "./HeatMap";
// import { Trash2, ChevronDown, ChevronRight } from "lucide-react";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [userDetails, setUserDetails] = useState({ username: "username" });
//   const [repositories, setRepositories] = useState([]);
//   const [expandedRepoId, setExpandedRepoId] = useState(null);
//   const [expandedFiles, setExpandedFiles] = useState({});
//   const [fileMap, setFileMap] = useState({});

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const userId = localStorage.getItem("userId");
//       if (userId) {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userProfile/${userId}`);
//           setUserDetails(response.data);
//         } catch (err) {
//           console.error("Cannot fetch user details: ", err);
//         }
//       }
//     };

//     const fetchUserRepos = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       try {
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/user/${userId}`);
//         const data = await res.json();
//         setRepositories(data.repositories || []);

//         const map = {};
//         for (let repo of data.repositories || []) {
//           const grouped = {};
//           for (let file of repo.content) {
//             if (!grouped[file.originalName]) grouped[file.originalName] = [];
//             grouped[file.originalName].push(file);
//           }
//           map[repo._id] = grouped;
//         }
//         setFileMap(map);
//       } catch (err) {
//         console.error("Failed to fetch repositories", err);
//       }
//     };

//     fetchUserDetails();
//     fetchUserRepos();
//   }, []);

//   const toggleRepo = (repoId) => {
//     setExpandedRepoId((prev) => (prev === repoId ? null : repoId));
//   };

//   const toggleFile = (repoId, filename) => {
//     setExpandedFiles((prev) => {
//       const updated = { ...prev };
//       if (!updated[repoId]) updated[repoId] = new Set();
//       if (updated[repoId].has(filename)) {
//         updated[repoId].delete(filename);
//       } else {
//         updated[repoId].add(filename);
//       }
//       return { ...updated };
//     });
//   };

//   const handleDeleteRepo = async (repoId) => {
//     const confirm = window.confirm("Are you sure you want to delete this repository?");
//     if (!confirm) return;

//     try {
//       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/repo/delete/${repoId}`);
//       setRepositories(repositories.filter((r) => r._id !== repoId));
//       setExpandedRepoId(null);
//       alert("Repository deleted successfully.");
//     } catch (err) {
//       console.error("Error deleting repo", err);
//       alert("Failed to delete repository.");
//     }
//   };


//   const handleDeleteFile = async (repoId, commitId, filename) => {
//     const confirm = window.confirm(`Delete this version of ${filename}?`);
//     if (!confirm) return;

//     try {
//       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/repo/${repoId}/file/${filename}?commitId=${commitId}`);
//       setRepositories((prevRepos) =>
//         prevRepos.map((repo) => {
//           if (repo._id === repoId) {
//             const updatedContent = repo.content.filter(
//               (file) => !(file.originalName === filename && file.commitId === commitId)
//             );
//             return { ...repo, content: updatedContent };
//           }
//           return repo;
//         })
//       );
//       setFileMap((prev) => {
//         const updated = { ...prev };
//         updated[repoId][filename] = updated[repoId][filename].filter(f => f.commitId !== commitId);
//         if (updated[repoId][filename].length === 0) delete updated[repoId][filename];
//         return updated;
//       });
//     } catch (err) {
//       console.error("Failed to delete file", err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
//         <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
//           <div className="flex flex-col items-center md:items-start text-center md:text-left">
//             <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl border-4 border-white mb-4" />
//             <h3 className="text-2xl font-semibold text-cyan-300">{userDetails.username}</h3>
//           </div>
//           <div className="w-full md:w-1/2">
//             <div className="bg-gray-900 p-6 rounded-xl shadow-inner border border-white/10">
//               <HeatMapProfile />
//             </div>
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto mt-12">
//           <h2 className="text-2xl text-cyan-400 font-bold mb-6">Your Repositories</h2>
//           {repositories.length === 0 ? (
//             <p className="text-gray-400">No repositories yet.</p>
//           ) : (
//             <ul className="space-y-4">
//               {repositories.map((repo) => (
//                 <li key={repo._id} className="bg-gray-800 p-4 rounded-xl border border-white/10 shadow-md hover:shadow-lg transition">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleRepo(repo._id)}>
//                       {expandedRepoId === repo._id ? (
//                         <ChevronDown className="text-cyan-400" />
//                       ) : (
//                         <ChevronRight className="text-cyan-400" />
//                       )}
//                       <div>
//                         <h3 className="text-lg font-semibold text-blue-300">{repo.name}</h3>
//                         <p className="text-sm text-gray-400">{repo.description}</p>
//                       </div>
//                     </div>
//                     <button onClick={() => handleDeleteRepo(repo._id)} className="text-red-400 hover:text-red-600">
//                       <Trash2 size={18} />
//                     </button>

//                   </div>

//                   {expandedRepoId === repo._id && fileMap[repo._id] && (
//                     <div className="mt-4 bg-gray-900 rounded-xl p-4 border border-white/10 space-y-4">
//                       {Object.entries(fileMap[repo._id]).map(([filename, commits]) => (
//                         <div key={filename}>
//                           <div
//                             className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-lg cursor-pointer"
//                             onClick={() => toggleFile(repo._id, filename)}
//                           >
//                             <h4 className="text-md font-semibold text-cyan-300">
//                               {expandedFiles[repo._id]?.has(filename) ? "📂" : "📁"} {filename}
//                             </h4>
//                           </div>
//                           {expandedFiles[repo._id]?.has(filename) && (
//                             <ul className="text-sm space-y-2 text-gray-300 mt-2">
//                               {commits.map((commit) => (
//                                 <li
//                                   key={commit.commitId}
//                                   className="flex justify-between items-center border border-white/10 bg-zinc-800 px-3 py-2 rounded"
//                                 >
//                                   <div>
//                                     <span className="text-lime-400 mr-2">{commit.commitId.slice(0, 6)}</span>
//                                     <span className="text-gray-400">
//                                       {new Date(commit.date).toLocaleString()}
//                                     </span>
//                                   </div>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteFile(repo._id, commit.commitId, filename)
//                                     }
//                                     className="text-red-400 hover:text-red-600"
//                                   >
//                                     <Trash2 size={16} />
//                                   </button>
//                                 </li>
//                               ))}
//                             </ul>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             localStorage.removeItem("userId");
//             window.location.href = "/auth";
//           }}
//           className="fixed bottom-6 right-6 px-5 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition"
//         >
//           Logout
//         </button>
//       </div>
//     </>
//   );
// };

// export default Profile;



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
                    className="text-red-400 hover:text-red-600 text-sm"
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
                          <div
                            key={file.commitId}
                            className="bg-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm text-white">🕓 {new Date(file.date).toLocaleString()}</p>
                              <p className="text-sm text-gray-400">🔐 Commit ID: {file.commitId.slice(0, 6)}</p>
                            </div>
                            <button
                              onClick={() => {
                                setDeleteTarget({ type: "file", repoId: repo._id, filename, commitId: file.commitId });
                                setShowConfirm(true);
                              }}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              🗑 Delete
                            </button>
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
          className="fixed bottom-6 right-6 px-5 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition"
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
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
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

