"use client";

import { useEffect, useState } from "react";

export default function StudentProgress() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadProgress() {
      const res = await fetch("/api/student/my-learning", {
        cache: "no-store",
      });

      if (!res.ok) {
        setCourses([]);
        return;
      }

      const data = await res.json();
      setCourses(data.courses || []);
    }

    loadProgress();
  }, []);

  // Get progress from localStorage
  const getProgress = (courseId, lessons) => {
    const completed =
      JSON.parse(localStorage.getItem(`completed-${courseId}`)) || {};
    const completedCount = lessons.filter((l) => completed[l.title]).length;
    const total = lessons.length;

    return total === 0 ? 0 : Math.round((completedCount / total) * 100);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Progress Overview</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">No courses assigned yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progress = getProgress(course._id, course.lessons || []);

          return (
            <div
              key={course._id}
              className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
            >
              {/* THUMBNAIL (fixed height) */}
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Thumbnail</span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.category}</p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-blue-600 h-3 rounded"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm">{progress}% completed</p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
