import React from "react";
import { FaRobot } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

function Header({ assistantName, userName, onLogout, onCustomize }) {
  return (
    <header className="w-full h-20 px-8 flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex justify-center items-center shadow-lg">
          <FaRobot className="text-white text-2xl" />
        </div>

        <div>
          <h1 className="text-white text-2xl font-bold tracking-wide">
            {assistantName || "SIFRA AI"}
          </h1>

          <p className="text-gray-300 text-sm">
            Your Smart Voice Assistant
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        <div className="text-right hidden md:block">
          <h2 className="text-white font-semibold text-lg">
            Welcome,
          </h2>

          <p className="text-cyan-300">
            {userName || "User"}
          </p>
        </div>

        <button
          onClick={onCustomize}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-purple-600 transition duration-300 flex justify-center items-center"
        >
          <IoSettingsSharp className="text-white text-2xl" />
        </button>

        <button
          onClick={onLogout}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 duration-300 flex items-center gap-2 text-white font-semibold shadow-lg"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>

      </div>
    </header>
  );
}

export default Header;