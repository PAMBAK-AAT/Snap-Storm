




// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const RepoDetails = () => {
//   const { id } = useParams();
//   const [repo, setRepo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");
//   const [fileContent, setFileContent] = useState("");
//   const [activeFile, setActiveFile] = useState(null);
//   const [commitMessage, setCommitMessage] = useState("");
//   const [fileLoading, setFileLoading] = useState(false);
//   const [availableCommits, setAvailableCommits] = useState([]);
//   const [selectedCommitId, setSelectedCommitId] = useState(null);

//   const fileInputRef = useRef();
//   const messageInputRef = useRef();

//   const fetchRepo = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}`);
//       const data = await response.json();
//       setRepo(data[0]);
//     } catch (err) {
//       console.error("Error fetching repo:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRepo();
//   }, [id]);

//   const handlePush = async (e) => {
//     e.preventDefault();
//     if (!file || !message) return alert("Please select a file and write a commit message.");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("message", message);

//     try {
//       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}/push`, formData);
//       setStatus("✅ File pushed successfully!");
//       setFile(null);
//       setMessage("");
//       fileInputRef.current.value = "";
//       messageInputRef.current.value = "";
//       await fetchRepo();
//     } catch (err) {
//       console.error("Push failed:", err);
//       setStatus("❌ Failed to push file");
//     }
//   };

//   const fetchFileContent = async (filename, commitId) => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}/file/${filename}?commit=${commitId}`);
//       const data = await res.json();
//       setFileContent(data.fileContent);
//       setCommitMessage(data.commitMessage);
//     } catch (err) {
//       console.error("Error fetching file content:", err);
//       setFileContent("❌ Error loading file content.");
//     }
//   };

//   const handleFileClick = (filename) => {
//     const allCommits = repo.content
//       .filter((f) => f.originalName === filename)
//       .sort((a, b) => new Date(b.date) - new Date(a.date));

//     const latest = allCommits[allCommits.length - 1];

//     setActiveFile({ filename });
//     setAvailableCommits(allCommits);
//     setSelectedCommitId(latest.commitId);
//     fetchFileContent(filename, latest.commitId);
//   };

//   const handleCommitChange = (e) => {
//     const commitId = e.target.value;
//     setSelectedCommitId(commitId);
//     fetchFileContent(activeFile.filename, commitId);
//   };

//   if (loading) {
//     return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
//   }

//   if (!repo) {
//     return <div className="min-h-screen bg-black text-white flex items-center justify-center">Repository not found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
//       <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg backdrop-blur-lg">
//         <h2 className="text-3xl font-bold text-cyan-400 mb-4">{repo.name}</h2>
//         <p className="text-gray-300 mb-4">{repo.description || "No description provided."}</p>

//         <div className="mb-6">
//           <span className="text-sm px-3 py-1 rounded-full bg-cyan-600 text-black font-semibold">
//             {repo.visibility ? "Public" : "Private"}
//           </span>
//         </div>

//         <h3 className="text-xl font-bold text-blue-300 mb-2">Files:</h3>
//         {Array.isArray(repo.content) && repo.content.length > 0 ? (
//           <ul className="space-y-2 text-gray-300 mb-6">
//             {[...new Set(repo.content.map((file) => file.originalName))].map((filename, idx) => (
//               <li
//                 key={idx}
//                 className="bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 cursor-pointer"
//                 onClick={() => handleFileClick(filename)}
//               >
//                 {filename}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-400 mb-6">No content yet. Push code to get started.</p>
//         )}

//         {activeFile && (
//           <div className="relative mt-6 bg-black/70 border border-white/20 p-4 rounded-xl max-h-[500px] overflow-auto">
//             {/* ❌ Close Button */}
//             <button
//               onClick={() => {
//                 setActiveFile(null);
//                 setFileContent("");
//                 setCommitMessage("");
//                 setAvailableCommits([]);
//                 setSelectedCommitId("");
//               }}
//               className="absolute cursor-pointer top-2 right-2 text-white bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded shadow"
//             >
//               ❌ Close
//             </button>

//             <h3 className="text-lg font-bold text-green-400 mb-1">📄 {activeFile.filename}</h3>

//             <div className="mb-4">
//               <label className="text-sm text-white mr-2">Select Commit:</label>
//               <select
//                 value={selectedCommitId || ""}
//                 onChange={handleCommitChange}
//                 className="bg-zinc-800 text-white border border-white/20 rounded px-2 py-1"
//               >
//                 {availableCommits.map((commit, idx) => (
//                   <option key={idx} value={commit.commitId}>
//                     {new Date(commit.date).toLocaleString()} – {commit.commitId.slice(0, 6)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <p className="text-sm text-fuchsia-400 mb-3 italic">💬 {commitMessage}</p>
//             <pre className="whitespace-pre-wrap text-sm text-gray-200">
//               {fileLoading ? "⏳ Loading..." : fileContent}
//             </pre>
//           </div>
//         )}


//         <div className="bg-zinc-800 p-6 rounded-xl shadow-md mt-10">
//           <h4 className="text-2xl font-bold text-purple-400 mb-4">🚀 Push Code</h4>
//           <form onSubmit={handlePush} className="space-y-4">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full cursor-pointer bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
//             />
//             <input
//               type="text"
//               ref={messageInputRef}
//               placeholder="Commit message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full cursor-pointer bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
//             />
//             <button
//               type="submit"
//               className="w-full cursor-pointer py-2 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:opacity-90 rounded text-white font-semibold transition"
//             >
//               Push to Repository
//             </button>
//           </form>

//           {status && <div className="mt-4 text-sm text-green-400">{status}</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RepoDetails;





import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RepoDetails = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [activeFile, setActiveFile] = useState(null);
  const [commitMessage, setCommitMessage] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [availableCommits, setAvailableCommits] = useState([]);
  const [selectedCommitId, setSelectedCommitId] = useState(null);

  const fileInputRef = useRef();
  const messageInputRef = useRef();

  const userId = localStorage.getItem("userId");

  const fetchRepo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}`);
      const data = await response.json();
      setRepo(data);
    } catch (err) {
      console.error("Error fetching repo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepo();
  }, [id]);

  const handlePush = async (e) => {
    e.preventDefault();
    if (!file || !message) return alert("Please select a file and write a commit message.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}/push`, formData);
      setStatus("✅ File pushed successfully!");
      setFile(null);
      setMessage("");
      fileInputRef.current.value = "";
      messageInputRef.current.value = "";
      await fetchRepo();
    } catch (err) {
      console.error("Push failed:", err);
      setStatus("❌ Failed to push file");
    }
  };

  const fetchFileContent = async (filename, commitId) => {
    try {
      setFileLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}/file/${filename}?commit=${commitId}`);
      const data = await res.json();
      setFileContent(data.fileContent);
      setCommitMessage(data.commitMessage);
    } catch (err) {
      console.error("Error fetching file content:", err);
      setFileContent("❌ Error loading file content.");
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileClick = (filename) => {
    const allCommits = repo.content
      .filter((f) => f.originalName === filename)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const latest = allCommits[allCommits.length - 1];

    setActiveFile({ filename });
    setAvailableCommits(allCommits);
    setSelectedCommitId(latest.commitId);
    fetchFileContent(filename, latest.commitId);
  };

  const handleCommitChange = (e) => {
    const commitId = e.target.value;
    setSelectedCommitId(commitId);
    fetchFileContent(activeFile.filename, commitId);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!repo) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Repository not found.</div>;
  }

  const isOwner = repo?.owner?._id?.toString() === userId; // ✅ CORRECT

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">{repo.name}</h2>
        <p className="text-gray-300 mb-4">{repo.description || "No description provided."}</p>

        <div className="mb-6">
          <span className="text-sm px-3 py-1 rounded-full bg-cyan-600 text-black font-semibold">
            {repo.visibility ? "Public" : "Private"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-blue-300 mb-2">Files:</h3>
        {Array.isArray(repo.content) && repo.content.length > 0 ? (
          <ul className="space-y-2 text-gray-300 mb-6">
            {[...new Set(repo.content.map((file) => file.originalName))].map((filename, idx) => (
              <li
                key={idx}
                className="bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 cursor-pointer"
                onClick={() => handleFileClick(filename)}
              >
                {filename}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mb-6">No content yet. Push code to get started.</p>
        )}

        {activeFile && (
          <div className="relative mt-6 bg-black/70 border border-white/20 p-4 rounded-xl max-h-[500px] overflow-auto">
            <button
              onClick={() => {
                setActiveFile(null);
                setFileContent("");
                setCommitMessage("");
                setAvailableCommits([]);
                setSelectedCommitId("");
              }}
              className="absolute cursor-pointer top-2 right-2 text-white bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded shadow"
            >
              ❌ Close
            </button>

            <h3 className="text-lg font-bold text-green-400 mb-1">📄 {activeFile.filename}</h3>

            <div className="mb-4">
              <label className="text-sm text-white mr-2">Select Commit:</label>
              <select
                value={selectedCommitId || ""}
                onChange={handleCommitChange}
                className="bg-zinc-800 text-white border border-white/20 rounded px-2 py-1"
              >
                {availableCommits.map((commit, idx) => (
                  <option key={idx} value={commit.commitId}>
                    {new Date(commit.date).toLocaleString()} – {commit.commitId.slice(0, 6)}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-fuchsia-400 mb-3 italic">💬 {commitMessage}</p>
            <pre className="whitespace-pre-wrap text-sm text-gray-200">
              {fileLoading ? "⏳ Loading..." : fileContent}
            </pre>
          </div>
        )}

        {/* Only show push form if the user is the owner */}
        {isOwner && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-md mt-10">
            <h4 className="text-2xl font-bold text-purple-400 mb-4">🚀 Push Code</h4>
            <form onSubmit={handlePush} className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full cursor-pointer bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
              />
              <input
                type="text"
                ref={messageInputRef}
                placeholder="Commit message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full cursor-pointer bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full cursor-pointer py-2 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:opacity-90 rounded text-white font-semibold transition"
              >
                Push to Repository
              </button>
            </form>

            {status && <div className="mt-4 text-sm text-green-400">{status}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetails;

