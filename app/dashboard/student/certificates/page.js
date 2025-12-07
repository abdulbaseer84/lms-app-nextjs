"use client";

import { useEffect, useState } from "react";

export default function Certificates() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCompletedCourses() {
      // Get courses assigned to the student
      const res = await fetch("/api/student/my-learning", {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();

      // Filter only completed courses (all lessons watched)
      const completed = data.courses.filter((course) => {
        const completedLessons =
          JSON.parse(localStorage.getItem(`completed-${course._id}`)) || {};

        const finishedCount = course.lessons.filter(
          (l) => completedLessons[l.title]
        ).length;

        return finishedCount === course.lessons.length; // fully complete
      });

      setCourses(completed);
    }

    loadCompletedCourses();
  }, []);

  function downloadCertificate(course) {
    const text = `
  CERTIFICATE OF COMPLETION

  This is to certify that you have successfully completed:

  Course: ${course.title}
  Category: ${course.category}
  Level: ${course.level}

  Congratulations!
  `;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.title}-certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Certificates</h1>

      {/* No certificates */}
      {courses.length === 0 && (
        <p className="text-gray-500">You haven’t completed any courses yet.</p>
      )}

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow rounded-lg p-6 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="h-40 bg-gray-200 rounded mb-4">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Thumbnail
                </div>
              )}
            </div>

            <h2 className="font-semibold text-lg">{course.title}</h2>

            <p className="text-gray-600 text-sm mt-1">
              Completed On: {new Date().toLocaleDateString()}
            </p>

            <button
              onClick={() => downloadCertificate(course)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
