"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      const c = await fetch("/api/courses").then((r) => r.json());
      const u = await fetch("/api/admin/users").then((r) => r.json());

      setCourses(c.courses || []);
      setUsers(u.users || []);
    }

    loadData();
  }, []);

  // Instructors
  const instructors = users.filter((u) => u.role === "instructor");

  // Courses per instructor
  const coursesByInstructor = instructors.map((inst) => ({
    name: inst.name,
    email: inst.email,
    total: courses.filter(
      (c) => c.instructor && c.instructor._id === inst._id
    ).length,
  }));

  // Category breakdown
  const categories = {};
  courses.forEach((c) => {
    categories[c.category] = (categories[c.category] || 0) + 1;
  });

  // Level breakdown
  const levels = {};
  courses.forEach((c) => {
    levels[c.level] = (levels[c.level] || 0) + 1;
  });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Analytics</h1>

      {/* Courses by Instructor */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Courses Created by Instructors</h2>
        <div className="bg-white shadow p-6 rounded-xl">
          {coursesByInstructor.length === 0 ? (
            <p>No instructors found</p>
          ) : (
            coursesByInstructor.map((i) => (
              <div key={i.email} className="border-b py-3 flex justify-between">
                <div>
                  <p className="font-bold">{i.name}</p>
                  <p className="text-sm text-gray-500">{i.email}</p>
                </div>
                <p className="text-xl font-bold text-blue-600">{i.total} course(s)</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
        <div className="bg-white shadow p-6 rounded-xl">
          {Object.keys(categories).map((cat) => (
            <p key={cat} className="border-b py-2 flex justify-between">
              <span>{cat}</span>
              <span className="font-bold">{categories[cat]}</span>
            </p>
          ))}
        </div>
      </section>

      {/* Level Breakdown */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Level Breakdown</h2>
        <div className="bg-white shadow p-6 rounded-xl">
          {Object.keys(levels).map((lvl) => (
            <p key={lvl} className="border-b py-2 flex justify-between">
              <span>{lvl}</span>
              <span className="font-bold">{levels[lvl]}</span>
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
