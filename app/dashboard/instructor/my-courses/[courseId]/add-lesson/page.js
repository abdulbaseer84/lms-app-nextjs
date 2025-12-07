"use client";

import { useState } from "react";

export default function AddLessonPage({ params }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    position: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/courses/${params.courseId}/lessons`, {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Add Lesson</h1>

      <form className="flex flex-col gap-3 w-1/2 mt-4" onSubmit={handleSubmit}>
        <input
          placeholder="Lesson Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Video URL (optional)"
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />

        <textarea
          rows="5"
          placeholder="Content / Description"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        ></textarea>

        <input
          type="number"
          placeholder="Sort Order (e.g., 1,2,3)"
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <button className="bg-blue-600 text-white p-2">Add Lesson</button>
      </form>
    </div>
  );
}
