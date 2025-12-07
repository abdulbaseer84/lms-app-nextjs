"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function LearningPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const videoRef = useRef(null);

  // Load course with completed lessons from localStorage
  useEffect(() => {
    async function loadCourse() {
      const res = await fetch(`/api/courses/${courseId}`, {
        cache: "no-store",
      });
      const data = await res.json();

      // Load completed lessons from storage
      const completed =
        JSON.parse(localStorage.getItem(`completed-${courseId}`)) || {};

      const lessons = data.course.lessons.map((lesson) => ({
        ...lesson,
        completed: !!completed[lesson.title],
      }));

      setCourse({ ...data.course, lessons });
      setCurrentLesson(lessons[0]);
    }

    loadCourse();
  }, [courseId]);

  // When video finishes → mark lesson as completed
  const handleVideoEnd = () => {
    if (!currentLesson) return;

    const completed =
      JSON.parse(localStorage.getItem(`completed-${courseId}`)) || {};

    completed[currentLesson.title] = true;

    localStorage.setItem(`completed-${courseId}`, JSON.stringify(completed));

    // Update UI state
    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) =>
        l.title === currentLesson.title ? { ...l, completed: true } : l
      ),
    }));
  };

  if (!course || !currentLesson) {
    return (
      <p className="p-10 text-center text-gray-500">
        Loading course, please wait...
      </p>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* VIDEO PLAYER */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-3">{currentLesson.title}</h1>

        <video
          ref={videoRef}
          src={currentLesson.videoUrl}
          controls
          onEnded={handleVideoEnd}
          className="w-full rounded shadow mb-4"
        />

        <p className="text-gray-600">{course.title}</p>
      </div>

      {/* LESSON PLAYLIST */}
      <div className="bg-white shadow rounded p-4 h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">Lessons</h2>

        {course.lessons.map((lesson, idx) => (
          <div
            key={idx}
            className={`p-3 mb-3 rounded cursor-pointer border flex justify-between items-center ${
              currentLesson.title === lesson.title
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
            onClick={() => setCurrentLesson(lesson)}
          >
            <div>
              <p className="font-semibold">{lesson.title}</p>
              <p className="text-sm text-gray-500">{lesson.duration}</p>
            </div>

            {/* ✔ TICK MARK */}
            {lesson.completed && (
              <span className="text-green-600 text-xl font-bold">✔</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
