import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatRoom({ roomName }) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/messages/", {
          params: { room_name: roomName },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [roomName]);

  // Connect WebSocket
  useEffect(() => {
    const token = localStorage.getItem("access");

    ws.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`
    );

    ws.current.onopen = () => console.log("WebSocket connected ✅");

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // 🔥 Online user update
      if (data.online) {
        setOnline(data.online);
        return;
      }

      // 🔥 Chat message
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => console.log("WebSocket disconnected ❌");

    return () => ws.current.close();
  }, [roomName]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (input.trim() === "") return;
    ws.current.send(JSON.stringify({ message: input }));
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 shadow-lg">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            Room: {roomName}
          </h2>
          <p className="text-blue-100 text-sm mt-1">Connected and ready to chat</p>
        </div>

        {/* ONLINE USERS */}
        <div className="px-6 py-3 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">
            Online Users ({online.length})
          </h3>

          <div className="flex gap-2 mt-2 flex-wrap">
            {online.map((u, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm shadow-sm"
              >
                🟢 {u}
              </span>
            ))}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-md hover:shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {(msg.user_id || msg.user || "?")[0].toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <b className="text-gray-800 font-semibold">
                    {msg.user_id || msg.user || "Unknown"}
                  </b>
                  <span className="text-xs text-gray-500">just now</span>
                </div>

                <span className="text-gray-700 leading-relaxed">
                  {msg.message || msg.content}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-inner transition-all text-lg"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Send
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 ml-2">
            Press Enter to send your message
          </p>
        </div>

      </div>
    </div>
  );
}

export default ChatRoom;
