import React from "react";
import {
  FaHome,
  FaHistory,
  FaRobot,
  FaCog,
  FaMicrophone,
} from "react-icons/fa";

function Sidebar({
  assistantName,
  history = [],
  onCustomize,
}) {
  return (
    <aside className="w-[280px] h-screen bg-white/10 backdrop-blur-xl border-r border-white/10 flex flex-col">

      {/* Top */}
      <div className="h-24 flex items-center justify-center border-b border-white/10">

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex justify-center items-center mx-auto shadow-xl">

            <FaRobot className="text-white text-4xl" />

          </div>

          <h2 className="text-white mt-3 text-xl font-bold">
            {assistantName || "SIFRA AI"}
          </h2>

        </div>

      </div>

      {/* Menu */}

      <div className="flex flex-col gap-3 mt-8 px-5">

        <button className="flex items-center gap-4 text-white hover:bg-white/10 rounded-xl px-4 py-3 duration-300">

          <FaHome />

          Home

        </button>

        <button className="flex items-center gap-4 text-white hover:bg-white/10 rounded-xl px-4 py-3 duration-300">

          <FaMicrophone />

          Voice Assistant

        </button>

        <button className="flex items-center gap-4 text-white hover:bg-white/10 rounded-xl px-4 py-3 duration-300">

          <FaCog />

          Settings

        </button>

        <button
          onClick={onCustomize}
          className="flex items-center gap-4 text-white hover:bg-purple-600 rounded-xl px-4 py-3 duration-300"
        >
          <FaRobot />

          Customize Assistant

        </button>

      </div>

      {/* History */}

      <div className="mt-8 flex-1 overflow-y-auto px-5">

        <div className="flex items-center gap-2 mb-4 text-cyan-300">

          <FaHistory />

          <h3 className="font-semibold">Recent Commands</h3>

        </div>

        {history.length === 0 ? (

          <p className="text-gray-400 text-sm">
            No history yet
          </p>

        ) : (

          history
            .slice()
            .reverse()
            .map((item, index) => (

              <div
                key={index}
                className="bg-white/10 rounded-xl p-3 mb-3 text-gray-200 text-sm hover:bg-white/20 duration-300 cursor-pointer truncate"
              >
                {item}
              </div>

            ))

        )}

      </div>

      {/* Footer */}

      <div className="p-5 border-t border-white/10 text-center">

        <p className="text-gray-400 text-sm">

          Smart AI Assistant

        </p>

        <p className="text-cyan-400 font-semibold">

          Version 2.0

        </p>

      </div>

    </aside>
  );
}

export default Sidebar;