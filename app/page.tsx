"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

export default function Chat() {
  const [universalPrompt, setUniversalPrompt] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPrompt = localStorage.getItem("universalPrompt");
    if (storedPrompt) {
      setUniversalPrompt(storedPrompt);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("universalPrompt", universalPrompt);
  }, [universalPrompt]);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      universalPrompt,
    },
    onError(error) {
      console.error("Chat error:", error);
      setError("Something went wrong. Please try again.");
    },
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSafeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    handleInputChange(e);
  };

  const handleValidatedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a message.");
      return;
    }
    setError(null);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-2xl lg:max-w-3xl h-screen mx-auto px-4 sm:px-0">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`my-4 md:max-w-10/12 ${
              message.role === "user"
                ? "ml-auto bg-teal-700 text-white"
                : "mr-auto bg-zinc-900 text-white"
            } p-4 rounded-xl`}
          >
            <div className="prose dark:prose-invert prose-li:mb-2">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
      </div>

      {status === "submitted" && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-500"></div>
        </div>
      )}

      <form
        onSubmit={handleValidatedSubmit}
        className="p-4 border-t border-zinc-300 dark:border-zinc-800"
      >
        <input
          disabled={status === "submitted"}
          className="w-full p-2 border rounded shadow-xl dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800"
          value={input}
          placeholder="Say something..."
          onChange={handleSafeInputChange}
        />
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-full p-2 mt-2 text-sm text-zinc-500 dark:text-zinc-400 hover:underline flex items-center justify-center"
        >
          Settings
          {universalPrompt && (
            <span className="ml-2 w-2 h-2 bg-teal-500 rounded-full"></span>
          )}
        </button>
      </form>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4">Universal Prompt</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              This prompt will be prepended to every message you send.
            </p>
            <textarea
              className="w-full p-2 mt-2 border rounded shadow-xl dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              value={universalPrompt}
              placeholder="e.g., Respond in pidgin English."
              onChange={(e) => setUniversalPrompt(e.target.value)}
              rows={5}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setUniversalPrompt("");
                  setIsSettingsOpen(false);
                }}
                className="rounded-md bg-red-500/10 px-2.5 py-1.5 text-sm font-semibold text-red-500 shadow-xs hover:bg-red-500/20"
              >
                Clear Prompt
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-md bg-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
