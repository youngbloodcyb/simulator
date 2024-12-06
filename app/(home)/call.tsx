"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    onDisconnect: () => setIsStarted(false),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  // Start conversation when voice data is available
  // useEffect(() => {
  //   if (voiceData?.url) {
  //     startConversation(voiceData.url);
  //   }
  // }, [voiceData]);

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
      <div className="inline-flex items-center gap-2">
        <Button onClick={() => setIsStarted(true)}>Get Started</Button>
        <Button variant="ghost" asChild>
          <Link
            href="https://github.com/youngbloodcyb/simulator"
            target="_blank"
          >
            GitHub
          </Link>
        </Button>
      </div>
    );
  }

  if (!voiceData) return <div>Loading...</div>;
  if (error) return <div>Error loading voice data</div>;

  return (
    <div className="flex flex-col">
      {/* Show instructions if available */}
      {voiceData.instructions && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Instructions:</h3>
          <p className="italic text-sm max-w-lg">{voiceData.instructions}</p>
        </div>
      )}

      <div className="flex gap-2">
        {conversation.status === "disconnected" ? (
          <Button onClick={() => startConversation(voiceData.url)}>
            I&apos;m Ready
          </Button>
        ) : (
          <div className="inline-flex items-center gap-2">
            <Button
              onClick={stopConversation}
              disabled={conversation.status !== "connected"}
              variant="destructive"
            >
              Disconnect
            </Button>
            {/* Add audio wave animation */}
            <div className="flex items-center gap-1 h-full">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`w-1.5 bg-black rounded-full transition-all duration-150 ${
                    conversation.isSpeaking ? "animate-sound-wave" : "h-2"
                  }`}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-4">
        <p className="text-sm font-light italic">
          Status: {conversation.status}
        </p>
        {conversation.status === "connected" && (
          <p className="text-sm font-light italic">
            Caller is {conversation.isSpeaking ? "speaking" : "listening"}
          </p>
        )}
      </div>

      {/* <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) =>
          conversation.setVolume({ volume: Number(e.target.value) })
        }
        defaultValue="1"
        className="w-48"
      /> */}
    </div>
  );
}
