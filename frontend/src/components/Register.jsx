import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      return setError("Please fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });

      setSuccess(res.data.message || "Registered successfully");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full border p-3 rounded" />

          <button disabled={loading} className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have account? <Link to="/" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}