
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [repoData, setRepoData] = useState({
    name: "",
    description: "",
    visibility: true, // true = public, false = private
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRepoData({
      ...repoData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...repoData,
          owner: userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Repository created!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(result.error || "Failed to create repository");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-xl border border-white/20 backdrop-blur-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">🚀 Create New Repository</h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Repository Name</label>
          <input
            type="text"
            name="name"
            value={repoData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-900 border border-cyan-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter a unique name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Description</label>
          <textarea
            name="description"
            value={repoData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-900 border border-cyan-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Optional description..."
          />
        </div>

        <div className="mb-6 flex items-center space-x-2">
          <input
            type="checkbox"
            name="visibility"
            checked={repoData.visibility}
            onChange={handleChange}
            id="visibility"
            className="accent-cyan-500"
          />
          <label htmlFor="visibility" className="text-gray-300">
            Public Repository
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition duration-300"
        >
          ➕ Create Repository
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;
