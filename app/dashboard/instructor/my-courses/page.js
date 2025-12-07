"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
      </div>
    </div>
  );
}
