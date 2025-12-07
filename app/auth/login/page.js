"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Login successful!");

    setTimeout(() => {
      console.log("Redirecting to dashboard...");
      window.location.href = "/";
    }, 1200);
  }

  return (
    <div className="max-w-md mx-auto mt-28 bg-white shadow p-6 rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password + Toggle Button */}
        <div className="relative">
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="p-3 border rounded w-full"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-500"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
