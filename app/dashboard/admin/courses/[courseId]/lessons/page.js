"use client";

import { use, useState, useEffect } from "react";

export default function LessonsPage(props) {
  const { courseId } = use(props.params);

  const [lessons, setLessons] = useState([]);

  const [editLessonId, setEditLessonId] = useState(null);
  const [editSubtopic, setEditSubtopic] = useState({ lessonId: null, index: null });

  const [lessonTitleInput, setLessonTitleInput] = useState("");

  const [subtopicForm, setSubtopicForm] = useState({ title: "", videoUrl: "" });
  const [newSubtopicForm, setNewSubtopicForm] = useState({});

  const [deleteData, setDeleteData] = useState({ type: null, lessonId: null, index: null });

  async function loadLessons() {
    const res = await fetch(`/api/lessons?courseId=${courseId}`, { cache: "no-store" });
    const data = await res.json();

    const fixed = data.lessons.map((lesson) => ({
      ...lesson,
      subtopics: lesson.subtopics.map((s) =>
        typeof s === "string" ? { title: s, videoUrl: "" } : s
      ),
    }));

    setLessons(fixed);
  }

  useEffect(() => {
    loadLessons();
  }, []);

  async function addLesson() {
    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Lesson", subtopics: [], courseId }),
    });

    loadLessons();
  }

  async function saveLessonTitle(id) {
    const lesson = lessons.find((l) => l._id === id);

    await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lesson, title: lessonTitleInput }),
    });

    setEditLessonId(null);
    loadLessons();
  }

  async function deleteLesson() {
    await fetch("/api/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteData.lessonId }),
    });

    setDeleteData({ type: null });
    loadLessons();
  }

  async function saveSubtopic(lessonId, index) {
    const lesson = lessons.find((l) => l._id === lessonId);

    const updated = [...lesson.subtopics];
    updated[index] = subtopicForm;

    await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lesson, subtopics: updated }),
    });

    setEditSubtopic({ lessonId: null, index: null });
    loadLessons();
  }

  async function confirmDeleteSubtopic() {
    const { lessonId, index } = deleteData;
    const lesson = lessons.find((l) => l._id === lessonId);

    const updated = lesson.subtopics.filter((_, i) => i !== index);

    await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lesson, subtopics: updated }),
    });

    setDeleteData({ type: null });
    loadLessons();
  }

  async function addSubtopic(lessonId) {
    const sub = newSubtopicForm[lessonId];
    if (!sub || !sub.title.trim()) return;

    const lesson = lessons.find((l) => l._id === lessonId);

    await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lesson,
        subtopics: [...lesson.subtopics, sub],
      }),
    });

    setNewSubtopicForm({
      ...newSubtopicForm,
      [lessonId]: { title: "", videoUrl: "" },
    });

    loadLessons();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Manage Lessons & Subtopics</h1>

      <button
        onClick={addLesson}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-5"
      >
        ➕ Add Lesson
      </button>

      <div className="space-y-5">
        {lessons.map((lesson) => (
          <div key={lesson._id} className="border rounded p-4">
            {/* LESSON TITLE */}
            <div className="flex justify-between mb-3">
              {editLessonId === lesson._id ? (
                <>
                  <input
                    value={lessonTitleInput}
                    onChange={(e) => setLessonTitleInput(e.target.value)}
                    className="border p-1 rounded w-full max-w-sm"
                  />

                  <button
                    onClick={() => saveLessonTitle(lesson._id)}
                    className="ml-2 px-3 py-1 bg-green-600 text-white rounded"
                  >
                    ✔️
                  </button>
                </>
              ) : (
                <>
                  <b>{lesson.title}</b>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditLessonId(lesson._id);
                        setLessonTitleInput(lesson.title);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        setDeleteData({ type: "lesson", lessonId: lesson._id })
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* SUBTOPICS */}
            <div className="ml-6 space-y-3">
              {lesson.subtopics.map((sub, index) => (
                <div key={index} className="flex justify-between items-start">
                  {editSubtopic.lessonId === lesson._id &&
                  editSubtopic.index === index ? (
                    <>
                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        <input
                          value={subtopicForm.title}
                          onChange={(e) =>
                            setSubtopicForm({
                              ...subtopicForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Subtopic title"
                          className="border p-1 rounded"
                        />

                        <input
                          value={subtopicForm.videoUrl}
                          onChange={(e) =>
                            setSubtopicForm({
                              ...subtopicForm,
                              videoUrl: e.target.value,
                            })
                          }
                          placeholder="Video URL"
                          className="border p-1 rounded"
                        />
                      </div>

                      <button
                        onClick={() => saveSubtopic(lesson._id, index)}
                        className="ml-2 px-3 py-1 bg-green-600 text-white rounded"
                      >
                        ✔️
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <p>{sub.title}</p>
                        {sub.videoUrl && (
                          <p className="text-xs text-gray-500">
                            🎬 {sub.videoUrl}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditSubtopic({ lessonId: lesson._id, index });
                            setSubtopicForm({
                              title: sub.title,
                              videoUrl: sub.videoUrl,
                            });
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            setDeleteData({
                              type: "subtopic",
                              lessonId: lesson._id,
                              index,
                            })
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* ADD SUBTOPIC */}
              <div className="flex mt-3 gap-2">
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <input
                    value={newSubtopicForm[lesson._id]?.title || ""}
                    onChange={(e) =>
                      setNewSubtopicForm({
                        ...newSubtopicForm,
                        [lesson._id]: {
                          ...newSubtopicForm[lesson._id],
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="New subtopic title"
                    className="border p-1 rounded"
                  />

                  <input
                    value={newSubtopicForm[lesson._id]?.videoUrl || ""}
                    onChange={(e) =>
                      setNewSubtopicForm({
                        ...newSubtopicForm,
                        [lesson._id]: {
                          ...newSubtopicForm[lesson._id],
                          videoUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="Video URL"
                    className="border p-1 rounded"
                  />
                </div>

                <button
                  onClick={() => addSubtopic(lesson._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM */}
      {deleteData.type && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

            <p className="mb-4">
              Are you sure you want to delete this{" "}
              <b>{deleteData.type}</b>?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setDeleteData({ type: null })}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={
                  deleteData.type === "lesson"
                    ? deleteLesson
                    : confirmDeleteSubtopic
                }
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
