"use client";

import { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
      const res = await fetch("/api/courses", { cache: "no-store" });
      const data = await res.json();
      setCourses(data.courses || []);
    }
    loadCourses();
  }, []);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">No courses found.</p>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <div className="w-full h-48 bg-gray-200">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-bold">{course.title}</h2>

              <p className="text-sm text-gray-500">
                {course.category} • {course.level}
              </p>

              <p className="text-blue-600 font-semibold text-lg mt-3">
                ₹ {course.price}
              </p>

              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full"
                onClick={() => (window.location.href = `/courses/${course._id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
