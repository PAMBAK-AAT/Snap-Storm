import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RepoDetails = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const fetchRepo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/${id}`);
      const data = await response.json();
      setRepo(data[0]); // Because backend sends an array
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
    if (!file || !message) {
      return alert("Please select a file and write a commit message.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    try {
      await axios.post(`http://localhost:3000/repo/${id}/push`, formData);
      setStatus("✅ File pushed successfully!");
      setFile(null);
      setMessage("");
      fetchRepo(); // Refresh the content
    } catch (err) {
      console.error("Push failed:", err);
      setStatus("❌ Failed to push file");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading repository...</p>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Repository not found.</p>
      </div>
    );
  }

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

        <h3 className="text-xl font-bold text-blue-300 mb-2">Files / Commits:</h3>
        {repo.content?.length > 0 ? (
          <ul className="space-y-2 text-gray-300 mb-6">
            {repo.content.map((file, idx) => (
              <li key={idx} className="bg-gray-800 px-4 py-2 rounded-xl">{file}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mb-6">No content yet. Push code to get started.</p>
        )}

        {/* Push Form */}
        <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
          <h4 className="text-2xl font-bold text-purple-400 mb-4">🚀 Push Code</h4>
          <form onSubmit={handlePush} className="space-y-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
            />

            <input
              type="text"
              placeholder="Commit message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2"
            />

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:opacity-90 rounded text-white font-semibold transition"
            >
              Push to Repository
            </button>
          </form>

          {status && (
            <div className="mt-4 text-sm text-green-400">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;
