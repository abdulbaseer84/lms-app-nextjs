"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
const router = useRouter();

async function handleSubmit(e) {
  e.preventDefault();

  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.message);
    return;
  }

  toast.success("Registration successful! Redirecting...");

  setTimeout(() => {
    router.push("/auth/login"); // smooth redirect
  }, 1200);
}

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          placeholder="Username *"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Full Name *"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email *"
          type="email"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="p-3 border rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Password *"
          type="password"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          placeholder="Confirm Password *"
          type="password"
          className="p-3 border rounded"
          required
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
