import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      {/* Tabs */}
      <UnderlineNav aria-label="Repository" sx={{ backgroundColor: "#1a1a1a" }}>
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      {/* Profile Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          {/* User Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl border-4 border-white mb-4" />
            <h3 className="text-2xl font-semibold text-cyan-300">{userDetails.username}</h3>
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold hover:scale-105 transition">
              Follow
            </button>
            <div className="mt-4 text-sm text-gray-300 flex gap-6">
              <p>10 Followers</p>
              <p>3 Following</p>
            </div>
          </div>

          {/* Heatmap */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-900 p-6 rounded-xl shadow-inner border border-white/10">
              <HeatMapProfile />
            </div>
          </div>
        </div>

        {/* Logout Button */}
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
    </>
  );
};

export default Profile;

