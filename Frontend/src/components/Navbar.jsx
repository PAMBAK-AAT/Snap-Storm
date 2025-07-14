



import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 w-[85%] max-w-4xl bg-gray-400 backdrop-blur-md border border-gray-200 shadow-md px-4 py-1 rounded-full flex items-center justify-between z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img
          src="/logo.svg"
          alt="Snap-Storm Logo"
          className="w-6 h-6 drop-shadow"
        />
        <h1 className="text-lg font-semibold text-gray-700 hover:text-yellow-700 transition tracking-tight">
          Snap Storm
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-4  items-center">
        <Link to="/create-repo">
          <button className="bg-gray-500 text-yellow-700 text-md cursor-pointer px-4 py-2 rounded-xl hover:bg-gray-200 transition">
            ➕ New Repo
          </button>
        </Link>


        <Link
          to="/profile"
          className="cursor-pointer text-lg px-3 py-1 rounded-md text-gray-700 hover:text-yellow-700 hover:bg-blue-100 transition"
        >
          Profile
        </Link>

        <Link
          to="/auth"
          className="cursor-pointer text-lg px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:border-gray-800 hover:text-yellow-600 hover:bg-gray-600 transition"
        >
          Login / Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
