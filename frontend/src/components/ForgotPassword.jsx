import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMsg(res.data.message);
    } catch (error) {
      setMsg("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        {msg && <p className="text-center mb-3 text-red-500">{msg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Send Link
          </button>
        </form>

        <p className="text-center mt-4">
          <Link to="/" className="text-blue-600">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;