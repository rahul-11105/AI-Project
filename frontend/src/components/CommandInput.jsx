import React from "react";
import { FaPaperPlane } from "react-icons/fa";

function CommandInput({
  typedCommand,
  setTypedCommand,
  processing,
  runAssistantCommand,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!typedCommand.trim()) return;

    runAssistantCommand(typedCommand);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl"
    >
      <input
        type="text"
        placeholder="Ask SIFRA anything..."
        value={typedCommand}
        onChange={(e) => setTypedCommand(e.target.value)}
        className="flex-1 bg-transparent outline-none text-white text-lg placeholder:text-gray-400 px-3"
      />

      <button
        type="submit"
        disabled={processing}
        className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-110 duration-300 flex justify-center items-center shadow-lg disabled:opacity-50"
      >
        <FaPaperPlane className="text-white text-xl" />
      </button>
    </form>
  );
}

export default CommandInput;