"use client";

import { useState } from "react";

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: 0,
    category: "",
    level: "beginner",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Course</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/2 mt-4">
        <input
          placeholder="Course Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Subtitle"
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
        <textarea
          placeholder="Description"
          rows="4"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <select
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button className="bg-blue-600 text-white p-2">Create</button>
      </form>
    </div>
  );
}
