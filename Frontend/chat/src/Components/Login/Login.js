import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setuserx }) {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [mmessage, setmessage] = useState("");
  const [status, setstatus] = useState(false);

  const navigate = useNavigate();

  // Auto login check (token verification)
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setmessage("Please login");
      return;
    }

    const islogin = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setmessage(res.data.msg);
        setstatus(res.data.status);
        setuserx(res.data.status);

        if (res.data.status) {
          navigate("/roomjoin");
        }
      } catch (err) {
        setmessage("Something went wrong");
      }
    };

    islogin();
  }, []);

  // Manual login submit
  const handlesubmit = async (e) => {
    e.preventDefault();
    setmessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/", {
        username,
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("access", data.tokens.ac);
      localStorage.setItem("refresh", data.tokens.re);

      setstatus(true);
      setuserx(true);
      setmessage("Login successful");

      navigate("/roomjoin");

    } catch (err) {
      setmessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto mt-10 p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chat Authentication
        </h2>
        <p className="text-center text-gray-600 mb-8">Welcome back! Please sign in</p>

        {/* Hide form if status is true */}
        {!status && (
          <form onSubmit={handlesubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
              className="border-2 border-gray-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm hover:border-blue-300"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
              className="border-2 border-gray-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm hover:border-blue-300"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
              className="border-2 border-gray-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm hover:border-blue-300"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
            >
              Register / Login
            </button>
          </form>
        )}

        <p
          className={`mt-6 text-center font-semibold text-lg px-4 py-3 rounded-xl ${
            status ? "text-green-700 bg-green-100 border-2 border-green-200" : "text-red-700 bg-red-100 border-2 border-red-200"
          }`}
        >
          {mmessage}
        </p>
      </div>
    </div>
  );
}