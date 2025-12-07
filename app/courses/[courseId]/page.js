"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      const res = await fetch(`/api/courses/${courseId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setCourse(data.course || null);
    }

    if (courseId) loadCourse();
  }, [courseId]);

  if (!course) {
    return (
      <p className="pt-32 text-center text-gray-500">
        Loading course, please wait...
      </p>
    );
  }

  return (
    <div className="pt-32 max-w-6xl mx-auto px-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Thumbnail */}
        <div>
          <div className="w-full h-72 bg-gray-200 rounded shadow">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{course.subtitle}</p>

          <div className="flex gap-4 text-sm text-gray-500 mb-3">
            <span>{course.category}</span>
            <span>•</span>
            <span className="capitalize">{course.level}</span>
          </div>

          {/* Instructor */}
          <p className="text-lg font-semibold mb-2">
            Instructor:{" "}
            <span className="text-blue-600">
              {course.instructor?.name || "Unknown"}
            </span>
          </p>

          {/* Price */}
          <p className="text-3xl text-green-600 font-bold mb-6">
            ₹ {course.price}
          </p>

          <button className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Course Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {course.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
