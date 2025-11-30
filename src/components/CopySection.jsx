import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopySection({ roomId }) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <button
      onClick={copyRoomId}
      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Room ID
        </>
      )}
    </button>
  );
}
