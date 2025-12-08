"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; 

export default function MyLearning() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
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

    loadCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">No courses assigned yet.</p>
      )}

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          if (!course) return null; // ⛑ Safety check

          return (
            <div
              key={course._id}
              className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
            >
              {/* --- SAFE THUMBNAIL --- */}
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course?.title || "Course"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Thumbnail</span>
                )}
              </div>

              {/* --- COURSE CONTENT --- */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{course?.title || "Untitled Course"}</h2>
                <p className="text-sm text-gray-500">{course?.category || "No category"}</p>
                <p className="text-sm capitalize mt-1 text-blue-600">
                  {course?.level || ""}
                </p>

                <Link
                  href={`/dashboard/student/my-learning/${course._id}`}
                  className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded w-full"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
