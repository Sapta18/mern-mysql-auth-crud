import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.email || !form.password) {
    return setError("Please fill all fields");
  }

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}