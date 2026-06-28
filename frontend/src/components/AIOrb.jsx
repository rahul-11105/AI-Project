import React from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsStars } from "react-icons/bs";

function AIOrb({ listening, processing, speaking }) {
  const getStatus = () => {
    if (processing) return "Thinking...";
    if (listening) return "Listening...";
    if (speaking) return "Speaking...";
    return "Ready";
  };

  const getColor = () => {
    if (processing) return "from-yellow-400 to-orange-500";
    if (listening) return "from-cyan-400 to-blue-600";
    if (speaking) return "from-pink-500 to-purple-600";
    return "from-purple-500 to-cyan-500";
  };

  const getIcon = () => {
    if (processing)
      return (
        <AiOutlineLoading3Quarters className="text-white text-5xl animate-spin" />
      );

    if (listening)
      return <FaMicrophone className="text-white text-5xl" />;

    return <BsStars className="text-white text-5xl" />;
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <motion.div
        animate={{
          scale: listening ? [1, 1.15, 1] : processing ? [1, 1.05, 1] : [1, 1.03, 1],
          rotate: processing ? 360 : 0,
        }}
        transition={{
          duration: processing ? 2 : 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-52 h-52 rounded-full bg-gradient-to-br ${getColor()}
        shadow-[0_0_80px_rgba(0,255,255,0.35)]
        flex items-center justify-center`}
      >
        {getIcon()}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-3xl font-bold mt-8"
      >
        SIFRA AI
      </motion.h2>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-cyan-300 mt-2 text-lg"
      >
        {getStatus()}
      </motion.p>

    </div>
  );
}

export default AIOrb;