"use client";

import { useEffect, useState } from "react";

export default function AskDoubts() {
  const [doubts, setDoubts] = useState([]);
  const [newDoubt, setNewDoubt] = useState("");
  const [replyText, setReplyText] = useState("");

  // Load doubts from DB
  async function loadDoubts() {
    const res = await fetch("/api/doubts", { cache: "no-store" });
    const data = await res.json();
    setDoubts(data.doubts || []);
  }

  useEffect(() => {
    loadDoubts();
  }, []);

  // Add new doubt
  async function addDoubt() {
    if (!newDoubt.trim()) return;

    const res = await fetch("/api/doubts", {
      method: "POST",
      body: JSON.stringify({ text: newDoubt }),
    });

    if (res.ok) {
      setNewDoubt("");
      loadDoubts();
    }
  }

  // Add reply
  async function addReply(doubtId) {
    if (!replyText.trim()) return;

    const res = await fetch("/api/doubts", {
      method: "PUT",
      body: JSON.stringify({
        doubtId,
        text: replyText,
      }),
    });

    if (res.ok) {
      setReplyText("");
      loadDoubts();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ask Doubts</h1>

      {/* CREATE DOUBT */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <textarea
          placeholder="Ask your doubt..."
          value={newDoubt}
          onChange={(e) => setNewDoubt(e.target.value)}
          className="w-full border p-3 rounded mb-3"
          rows="3"
        ></textarea>

        <button
          onClick={addDoubt}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ask Doubt
        </button>
      </div>

      {/* DOUBT LIST */}
      {doubts.length === 0 && (
        <p className="text-gray-500">No doubts asked yet.</p>
      )}

      <div className="flex flex-col gap-6">
        {doubts.map((d) => (
          <div key={d._id} className="bg-white shadow rounded p-4">
            <p className="text-gray-800 font-medium mb-2">{d.text}</p>

            <p className="text-xs text-gray-500 mb-3">
              Asked by: {d.userId?.name} •{" "}
              {new Date(d.createdAt).toLocaleString()}
            </p>

            {/* Replies */}
            <div className="ml-4 border-l pl-4">
              {d.replies.map((r) => (
                <div key={r._id} className="bg-gray-100 p-2 rounded mb-2">
                  <p>{r.text}</p>
                  <p className="text-xs text-gray-500">
                    — {r.userId?.name} •{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Add reply */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => addReply(d._id)}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
