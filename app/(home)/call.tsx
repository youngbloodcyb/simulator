"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

export function Call() {
  // Add state and SWR fetcher for API data
  const [isStarted, setIsStarted] = useState(false);
  const { data: voiceData, error } = useSWR(
    isStarted ? "/api/voice" : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch voice data");
      return res.json();
    }
  );

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  // Start conversation when voice data is available
  useEffect(() => {
    if (voiceData?.url) {
      startConversation(voiceData.url);
    }
  }, [voiceData]);

  const startConversation = useCallback(
    async (url: string) => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          signedUrl: url, // Use the URL from the API instead of hardcoded ID
        });
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    },
    [conversation]
  );

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Show loading/error states
  if (!isStarted) {
    return (
      <button
        onClick={() => setIsStarted(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start
      </button>
    );
  }

  if (!voiceData) return <div>Loading...</div>;
  if (error) return <div>Error loading voice data</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Show instructions if available */}
      {voiceData.instructions && (
        <div className="mb-4">
          <h3>Instructions:</h3>
          <p>{voiceData.instructions}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) =>
          conversation.setVolume({ volume: Number(e.target.value) })
        }
        defaultValue="1"
        className="w-48"
      />
    </div>
  );
}
