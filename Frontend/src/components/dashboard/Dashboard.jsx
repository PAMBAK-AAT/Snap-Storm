

// import { Link } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import Navbar from "../Navbar";

// const Dashboard = () => {
//     const [repositories, setRepositories] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [suggestedRepositories, setSuggestedRepositories] = useState([]);
//     const [searchResults, setSearchResults] = useState([]);

//     useEffect(() => {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const fetchRepositories = async () => {
//             try {
//                 const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/user/${userId}`);
//                 const data = await res.json();
//                 setRepositories(data.repositories || []);
//             } catch {
//                 setRepositories([]);
//             }
//         };

//         const fetchSuggested = async () => {
//             try {
//                 const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/all`);
//                 const data = await res.json();
//                 setSuggestedRepositories(data || []);
//             } catch {
//                 setSuggestedRepositories([]);
//             }
//         };

//         fetchRepositories();
//         fetchSuggested();
//     }, []);

//     useEffect(() => {
//         if (!searchQuery) setSearchResults(repositories);
//         else {
//             const filtered = repositories.filter((repo) =>
//                 repo.name?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//             setSearchResults(filtered);
//         }
//     }, [searchQuery, repositories]);

//     return (
//         <>
//             <Navbar />

//             {/* 🔆 Particle Background */}
//             <div className="fixed inset-0 -z-10 overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
//                 <div className="absolute inset-0">
//                     {[...Array(100)].map((_, i) => {
//                         const neonColors = [
//                             "bg-cyan-300",
//                             "bg-pink-400",
//                             "bg-purple-400",
//                             "bg-blue-400",
//                             "bg-emerald-300",
//                             "bg-fuchsia-400",
//                             "bg-orange-400",
//                             "bg-lime-300",
//                         ];
//                         const color = neonColors[Math.floor(Math.random() * neonColors.length)];
//                         return (
//                             <span
//                                 key={i}
//                                 className={`absolute rounded-full opacity-100 blur-sm ${color} animate-elliptic-glow`}
//                                 style={{
//                                     width: "14px",
//                                     height: "14px",
//                                     left: `${Math.random() * 100}%`,
//                                     animationDelay: `${Math.random() * 6}s`,
//                                     animationDuration: `${Math.random() * 5 + 4}s`,
//                                     filter: "drop-shadow(0 0 8px white)",
//                                 }}
//                             />
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Dashboard */}
//             <div className="min-h-screen p-6 md:p-12 mt-12  text-white flex flex-col lg:flex-row gap-8">
//                 {/* Suggested Repositories */}
//                 <aside className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg w-full lg:w-1/4">
//                     <h3 className="text-xl font-bold mb-4 text-cyan-300">Suggested Repositories</h3>
//                     {suggestedRepositories.length > 0 ? (
//                         suggestedRepositories.map((repo) => (
//                             <div key={repo._id} className="mb-4">
//                                 <h4 className="text-lg font-semibold text-blue-300">{repo.name}</h4>
//                                 <p className="text-gray-300 text-sm">{repo.description}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-400">No suggestions found.</p>
//                     )}
//                 </aside>

//                 {/* User Repositories */}
//                 <main className="flex-1 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
//                     <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Repositories</h2>

//                     <div className="mb-6">
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             placeholder="Search..."
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full p-3 rounded-xl bg-gray-900 border border-cyan-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
//                         />
//                     </div>

//                     {searchResults.length === 0 && (
//                         <p className="text-gray-400">No repositories found.</p>
//                     )}

//                     <div className="space-y-4">
//                         {searchResults.map((repo) => (
//                             <Link
//                                 to={`/repo/${repo._id}`}
//                                 key={repo._id}
//                                 className="block p-4 bg-gray-800 border border-white/10 rounded-xl shadow-md hover:shadow-xl transition hover:ring-2 hover:ring-cyan-400"
//                             >
//                                 <h4 className="text-lg font-semibold text-blue-300">{repo.name}</h4>
//                                 <p className="text-sm text-gray-300">{repo.description}</p>
//                             </Link>

//                         ))}
//                     </div>
//                 </main>

//                 {/* Right Sidebar */}
//                 <aside className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg w-full lg:w-1/4">
//                     <h3 className="text-xl font-bold mb-4 text-cyan-300">Upcoming Events</h3>
//                     <ul className="space-y-2 text-sm text-gray-300">
//                         <li className="bg-gray-800 p-3 rounded-xl">Tech Conference - Dec 15</li>
//                         <li className="bg-gray-800 p-3 rounded-xl">Developer Meetup - Dec 25</li>
//                         <li className="bg-gray-800 p-3 rounded-xl">React Summit - Jan 5</li>
//                     </ul>
//                 </aside>
//             </div>

//             {/* Keyframes */}
//             <style>{`
//         @keyframes elliptic-glow {
//           0% {
//             transform: translateY(100vh) scale(1) rotate(0deg);
//             opacity: 0;
//           }
//           10% {
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(-40vh) scale(0.8) rotate(1080deg);
//             opacity: 0;
//           }
//         }
//         .animate-elliptic-glow {
//           animation-name: elliptic-glow;
//           animation-timing-function: ease-in-out;
//           animation-iteration-count: infinite;
//           animation-fill-mode: forwards;
//           will-change: transform, opacity;
//         }
//       `}</style>
//         </>
//     );
// };

// export default Dashboard;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchRepositories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/user/${userId}`);
        const data = await res.json();
        setRepositories(data.repositories || []);
      } catch {
        setRepositories([]);
      }
    };

    const fetchSuggested = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/repo/all`);
        const data = await res.json();
        const publicRepos = (data || []).filter(repo => repo.visibility === true);
        setSuggestedRepositories(publicRepos);
      } catch {
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggested();
  }, []);

  useEffect(() => {
    if (!searchQuery) setSearchResults(repositories);
    else {
      const filtered = repositories.filter((repo) =>
        repo.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />

      {/* 🔆 Particle Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => {
            const neonColors = [
              "bg-cyan-300",
              "bg-pink-400",
              "bg-purple-400",
              "bg-blue-400",
              "bg-emerald-300",
              "bg-fuchsia-400",
              "bg-orange-400",
              "bg-lime-300",
            ];
            const color = neonColors[Math.floor(Math.random() * neonColors.length)];
            return (
              <span
                key={i}
                className={`absolute rounded-full opacity-100 blur-sm ${color} animate-elliptic-glow`}
                style={{
                  width: "14px",
                  height: "14px",
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${Math.random() * 5 + 4}s`,
                  filter: "drop-shadow(0 0 8px white)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Dashboard */}
      <div className="min-h-screen mt-13 p-6 md:p-12 text-white flex flex-col lg:flex-row gap-8">
        {/* Suggested Repositories */}
        <aside className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg w-full lg:w-1/4">
          <h3 className="text-xl font-bold mb-4 text-cyan-300">Suggested Repositories</h3>
          {suggestedRepositories.length > 0 ? (
            suggestedRepositories.map((repo) => (
              <Link
                key={repo._id}
                to={`/repo/${repo._id}`}
                className="block mb-4 cursor-pointer bg-gray-800 p-4 rounded-xl hover:bg-gray-700"
              >
                <h4 className="text-lg font-semibold text-blue-300">{repo.name}</h4>
                <p className="text-gray-300 text-sm">{repo.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">No suggestions found.</p>
          )}
        </aside>

        {/* User Repositories */}
        <main className="flex-1 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Repositories</h2>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-cyan-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            />
          </div>

          {searchResults.length === 0 && (
            <p className="text-gray-400">No repositories found.</p>
          )}

          <div className="space-y-4">
            {searchResults.map((repo) => (
              <Link
                to={`/repo/${repo._id}`}
                key={repo._id}
                className="block p-4 bg-gray-800 border border-white/10 rounded-xl shadow-md hover:shadow-xl transition hover:ring-2 hover:ring-cyan-400"
              >
                <h4 className="text-lg font-semibold text-blue-300">{repo.name}</h4>
                <p className="text-sm text-gray-300">{repo.description}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes elliptic-glow {
          0% {
            transform: translateY(100vh) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40vh) scale(0.8) rotate(1080deg);
            opacity: 0;
          }
        }
        .animate-elliptic-glow {
          animation-name: elliptic-glow;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
