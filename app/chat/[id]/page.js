"use client";
import { useState } from "react";
import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });

export default function Chat({ params }) {
  const companion = { id: params.id, name: params.id.toUpperCase(), image: `https://i.imgur.com/abc123.jpg` };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [liveVideo, setLiveVideo] = useState(null);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input, history: messages, nsfw, companion: companion.name }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    setInput("");
  };

  const generateLive = async () => {
    const last = messages[messages.length - 1]?.content || "Živjo!";
    const result = await fal.subscribe("fal-ai/live-portrait", {
      input: { face_image_url: companion.image, driving_audio_text: last }
    });
    setLiveVideo(result.data.video.url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">{companion.name}</h1>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={nsfw}
                onChange={(e) => setNsfw(e.target.checked)}
                className="w-5 h-5"
              />
              NSFW Mode
            </label>
            <button
              onClick={generateLive}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              Generate Live Video
            </button>
          </div>
        </div>

        {liveVideo && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
            <video src={liveVideo} controls className="w-full rounded-lg" />
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4 h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-pink-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send()}
            placeholder="Napiši sporočilo..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/50"
          />
          <button
            onClick={send}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition font-semibold"
          >
            Pošlji
          </button>
        </div>
      </div>
    </div>
  );
}
