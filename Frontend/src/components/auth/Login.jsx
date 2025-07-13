import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  LogInIcon,
} from "lucide-react";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(100)].map((_, i) => {
          const sizes = [14, 16, 18];
          const colors = ["bg-blue-400", "bg-purple-500", "bg-pink-500"];
          return (
            <span
              key={i}
              className={`absolute rounded-full opacity-80 animate-elliptic-glow ${colors[Math.floor(Math.random() * colors.length)]}`}
              style={{
                width: `${sizes[Math.floor(Math.random() * sizes.length)]}px`,
                height: `${sizes[Math.floor(Math.random() * sizes.length)]}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 10 + 6}s`,
              }}
            />
          );
        })}
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-[50vw] h-[70vh] bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl px-8 py-6 text-white flex flex-col justify-center">
        {/* Header Icon */}
        <div className="flex justify-center mb-2">
          <LogInIcon className="w-7 h-7 text-yellow-500" />
        </div>

        <h2 className="text-xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 focus-within:ring-2 ring-yellow-500">
            <MailIcon className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full cursor-pointer bg-transparent outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 focus-within:ring-2 ring-yellow-500">
            <LockIcon className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full cursor-pointer bg-transparent outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full  cursor-pointer bg-gradient-to-r from-gray-600 to-yellow-700 hover:from-gray-700 hover:to-yellow-700 text-white font-semibold py-2 rounded-lg shadow-md transition text-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-md mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-600 text-lg hover:underline cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes elliptic-glow {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(1);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            transform: translateY(-30vh) rotate(720deg) scale(0.7);
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
    </div>
  );
};

export default Login;
