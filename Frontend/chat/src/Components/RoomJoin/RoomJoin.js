import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomJoin = ({ setRoomName }) => {
  const [room, setroom] = useState("");
  const [message, setmessage] = useState("Enter a Room name for join or create Room");
  const navigate = useNavigate();

  const handlejoin = async () => {
    if (!room) {
      setmessage("Enter a Room name for join or create Room");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/room/", {
        room_name: room,
      });

      alert(
        res.data.created
          ? `Room '${res.data.room}' created!`
          : `Joined room '${res.data.room}'`
      );

      setRoomName(res.data.room);
      navigate("/chat");
    } catch (err) {
      setmessage("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Join or Create Room</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">{message}</p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Enter Room Name (e.g., team-chat, study-group)"
            value={room}
            onChange={(e) => setroom(e.target.value)}
            className="w-full border-2 border-gray-200 mt-3 px-6 py-4 rounded-2xl text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white/70 hover:border-indigo-300"
          />

          <button
            onClick={handlejoin}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Join / Create Room
          </button>
        </div>

        {/* Quick Join Suggestions */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">Quick join:</p>
          <div className="flex flex-wrap gap-3">
            {['general', 'random', 'gaming', 'study'].map((quickRoom) => (
              <button
                key={quickRoom}
                onClick={() => setroom(quickRoom)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 text-gray-700 hover:text-indigo-700 rounded-xl text-sm font-semibold transition-all transform hover:scale-105"
              >
                #{quickRoom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;