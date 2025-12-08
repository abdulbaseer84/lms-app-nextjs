"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function LearningPage() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSubtopic, setCurrentSubtopic] = useState(null);

  const videoRef = useRef(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      const courseRes = await fetch(`/api/courses/${courseId}`, {
        cache: "no-store",
      });
      const courseData = await courseRes.json();

      const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`, {
        cache: "no-store",
      });
      const lessonsData = await lessonsRes.json();

      setCourse(courseData.course);
      setLessons(lessonsData.lessons);

      if (lessonsData.lessons.length > 0) {
        const firstLesson = lessonsData.lessons[0];
        setCurrentLesson(firstLesson);

        // Auto-select first subtopic if available
        if (firstLesson.subtopics.length > 0) {
          const firstSub =
            typeof firstLesson.subtopics[0] === "string"
              ? { title: firstLesson.subtopics[0], videoUrl: "" }
              : firstLesson.subtopics[0];

          setCurrentSubtopic(firstSub);
        }
      }
    }

    loadData();
  }, [courseId]);

  const handleVideoEnd = () => {
    console.log("Video finished");
  };

  if (!course || !currentLesson) {
    return (
      <p className="p-10 text-center text-gray-500">
        Loading course, please wait...
      </p>
    );
  }

  // FIXED: Safe version
  let videoUrl = null;

  if (currentSubtopic && currentSubtopic.videoUrl?.trim()) {
    videoUrl = currentSubtopic.videoUrl;
  } else if (currentLesson.videoUrl?.trim()) {
    videoUrl = currentLesson.videoUrl;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* VIDEO PLAYER */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-2 pb-3">{course.title}</h1>
        <h2 className="text-xl font-semibold mb-1 pb-2">{currentLesson.title}</h2>

        {currentSubtopic && (
          <p className="text-md text-blue-600 mb-3">▶ {currentSubtopic.title}</p>
        )}

        {/* VIDEO PLAYER (supports YouTube + MP4) */}
        {videoUrl ? (
          videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
            <iframe
              className="w-full h-64 md:h-96 rounded shadow mb-4"
              src={videoUrl.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onEnded={handleVideoEnd}
              className="w-full rounded shadow mb-4"
            />
          )
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No video available
          </div>
        )}

      </div>

      {/* LESSONS + SUBTOPICS */}
      <div className="bg-white shadow rounded p-4 h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">Lessons</h2>

        {lessons.map((lesson) => (
          <div key={lesson._id} className="mb-3">
            <div
              className={`p-3 rounded cursor-pointer border ${currentLesson._id === lesson._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
                }`}
              onClick={() => {
                setCurrentLesson(lesson);

                if (lesson.subtopics.length > 0) {
                  const firstSub =
                    typeof lesson.subtopics[0] === "string"
                      ? { title: lesson.subtopics[0], videoUrl: "" }
                      : lesson.subtopics[0];

                  setCurrentSubtopic(firstSub);
                } else {
                  setCurrentSubtopic(null);
                }
              }}
            >
              <p className="font-semibold">{lesson.title}</p>
            </div>

            {lesson.subtopics.length > 0 && (
              <ul className="ml-6 mt-2 space-y-1">
                {lesson.subtopics.map((sub, idx) => {
                  const subObj =
                    typeof sub === "string"
                      ? { title: sub, videoUrl: "" }
                      : sub;

                  return (
                    <li
                      key={idx}
                      className={`p-2 rounded cursor-pointer text-sm border ${currentSubtopic?.title === subObj.title
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                        }`}
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setCurrentSubtopic(subObj);
                      }}
                    >
                      {subObj.title}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
