"use client";

import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      setUser(userData.user);

      const courseRes = await fetch("/api/student/my-learning", {
        cache: "no-store",
      });
      const courseData = await courseRes.json();
      setCourses(courseData.courses || []);
    }

    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded">
          <p className="text-gray-500">Welcome</p>
          <h2 className="text-xl font-bold">{user?.name}</h2>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <p className="text-gray-500">Courses Enrolled</p>
          <h2 className="text-xl font-bold">{courses.length}</h2>
        </div>
      </div>

      {/* Course cards */}
      <h2 className="text-2xl font-bold mb-3">Your Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          if (!course) return null; // ⛑️ Prevent crash if course = null

          return (
            <div
              key={course._id}
              className="bg-white shadow rounded overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course?.title || "course"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Thumbnail</span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {course?.title || "Untitled Course"}
                </h3>

                <p className="text-sm text-gray-600">
                  {course?.category || "No category"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
