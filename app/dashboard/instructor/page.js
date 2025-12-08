"use client";

import { useEffect, useState } from "react";

export default function InstructorOverview() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const c = await fetch("/api/courses").then((r) => r.json());
      const u = await fetch("/api/admin/users").then((r) => r.json());

      setCourses(c.courses || []);
      setUsers(u.users || []);
    }
    load();
  }, []);

  const totalCourses = courses.length;
  const totalPublished = courses.filter((c) => c.published).length;
  const totalStudents = users.filter((u) => u.role === "student").length;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Total Courses" value={totalCourses} color="text-blue-600" />
        <Card title="Published Courses" value={totalPublished} color="text-green-600" />
        <Card title="Total Students" value={totalStudents} color="text-purple-600" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="p-6 bg-white shadow border rounded-xl">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
