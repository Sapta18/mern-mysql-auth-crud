import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await api.post("/auth/reset-password", { token, password });
      setMsg(res.data.message);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {msg && <div className="bg-green-100 text-green-600 p-2 mb-3 rounded">{msg}</div>}
        {error && <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">{error}</div>}

        <input type="password" placeholder="New Password" className="w-full border p-3 rounded mb-3" onChange={(e)=>setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" className="w-full border p-3 rounded mb-4" onChange={(e)=>setConfirm(e.target.value)} />

        <button className="w-full bg-purple-600 text-white p-3 rounded">Update Password</button>
      </form>
    </div>
  );
}