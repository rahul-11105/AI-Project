import React, { useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

function ChatArea({ userText, aiText }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [userText, aiText]);

  return (
    <div className="w-full h-[450px] overflow-y-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-6">

      {!userText && !aiText && (
        <div className="h-full flex flex-col justify-center items-center text-center">

          <FaRobot className="text-cyan-400 text-7xl mb-5" />

          <h1 className="text-white text-3xl font-bold">
            Welcome to SIFRA AI
          </h1>

          <p className="text-gray-300 mt-3">
            Ask me anything using your voice or keyboard.
          </p>

        </div>
      )}

      {userText && (
        <div className="flex justify-end mb-5">

          <div className="max-w-[70%] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl px-5 py-4 shadow-lg">

            <div className="flex items-center gap-2 mb-2">

              <FaUser className="text-white" />

              <span className="text-white font-semibold">
                You
              </span>

            </div>

            <p className="text-white break-words">
              {userText}
            </p>

          </div>

        </div>
      )}

      {aiText && (
        <div className="flex justify-start">

          <div className="max-w-[70%] bg-white/10 rounded-3xl px-5 py-4 border border-cyan-500 shadow-lg">

            <div className="flex items-center gap-2 mb-2">

              <FaRobot className="text-cyan-400" />

              <span className="text-cyan-300 font-semibold">
                SIFRA AI
              </span>

            </div>

            <p className="text-white break-words">
              {aiText}
            </p>

          </div>

        </div>
      )}

      <div ref={bottomRef} />

    </div>
  );
}

export default ChatArea;