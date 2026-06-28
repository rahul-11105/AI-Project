import React from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";

function VoiceButton({
  listening,
  processing,
  handleStartListening,
  micMessage,
}) {
  return (
    <div className="flex flex-col items-center gap-5">

      {/* Animated Microphone */}

      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.9,
        }}
        animate={
          listening
            ? {
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 10px #06b6d4",
                  "0 0 40px #06b6d4",
                  "0 0 10px #06b6d4",
                ],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          repeat: listening ? Infinity : 0,
        }}
        disabled={processing}
        onClick={handleStartListening}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 flex justify-center items-center shadow-2xl disabled:opacity-50"
      >
        <FaMicrophone className="text-white text-4xl" />
      </motion.button>

      {/* Status */}

      <div className="text-center">

        <h2 className="text-white text-xl font-semibold">

          {listening ? "Listening..." : "Voice Assistant"}

        </h2>

        <p className="text-cyan-300 mt-2">

          {processing ? "Thinking..." : micMessage}

        </p>

      </div>

    </div>
  );
}

export default VoiceButton;