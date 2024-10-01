import React, { useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import "../../assets/styles/Login.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    // Handle login logic here
  };

  return (
    <div className="login-container">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-center mb-6">
          <AiOutlinePrinter size={50} className="text-gray-500" />
        </div>
        <h2 className="text-2xl text-center mb-4 font-bold text-gray-700">Printer Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <div className="flex items-center border border-gray-300 p-2 rounded">
              <FaFileAlt className="text-gray-500 mr-2" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" className="flex-1 outline-none" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <div className="flex items-center border border-gray-300 p-2 rounded">
              <FaFileAlt className="text-gray-500 mr-2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="flex-1 outline-none" />
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
