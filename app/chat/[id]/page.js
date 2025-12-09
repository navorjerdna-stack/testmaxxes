"use client";
import { useState } from "react";
import { companionsMap } from "@/lib/companions";

export default function Chat({ params }) {
  const companionData = companionsMap[params.id];
  const companion = companionData || { 
    id: params.id, 
    name: params.id.toUpperCase(), 
    image: "https://i.imgur.com/abc123.jpg" 
  };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [liveVideo, setLiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, history: messages, nsfw, companion: companion.name }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');
      // Remove the user message if the request failed
      setMessages(prev => prev.slice(0, -1));
      setInput(input); // Restore the input
    } finally {
      setLoading(false);
    }
  };

  const generateLive = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const last = messages[messages.length - 1]?.content || "Živjo!";
      const res = await fetch("/api/generate-live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          face_image_url: companion.img || companion.image, 
          driving_audio_text: last 
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data?.video?.url) {
        setLiveVideo(result.data.video.url);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Live video error:', err);
      setError(err.message || 'Failed to generate live video');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Live Video'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4 mb-4">
            {error}
          </div>
        )}

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
          {loading && (
            <div className="text-center text-white/70">
              <span className="inline-block animate-pulse">Typing...</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && send()}
            placeholder="Napiši sporočilo..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/50 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Pošlji'}
          </button>
        </div>
      </div>
    </div>
  );
}
