"use client";

import { useState, useEffect } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load from DB
  async function loadNotes() {
    const res = await fetch("/api/student/notes", { cache: "no-store" });
    const data = await res.json();
    setNotes(data.notes || []);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  /* -------------------------
       Add Note
  ------------------------- */
  async function addNote() {
    if (!newNote.trim()) return;

    const res = await fetch("/api/student/notes", {
      method: "POST",
      body: JSON.stringify({ text: newNote }),
    });

    if (res.ok) {
      setNewNote("");
      loadNotes();
    }
  }

  /* -------------------------
       Edit Note
  ------------------------- */
  async function saveEdit() {
    await fetch("/api/student/notes", {
      method: "PUT",
      body: JSON.stringify({ id: editId, text: editText }),
    });

    setEditId(null);
    setEditText("");
    loadNotes();
  }

  /* -------------------------
       Delete Note
  ------------------------- */
  async function deleteNote(id) {
    if (!confirm("Delete this note?")) return;

    await fetch("/api/student/notes", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    loadNotes();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>

      {/* Add new note */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <textarea
          placeholder="Write a note..."
          className="border p-3 rounded w-full mb-3"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows="3"
        />

        <button
          onClick={addNote}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Note
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 && (
        <p className="text-gray-500">No notes yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white shadow p-4 rounded">

            {editId === note._id ? (
              <>
                <textarea
                  className="border p-2 rounded w-full mb-3"
                  rows="4"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={saveEdit}
                  >
                    Save
                  </button>

                  <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-800 whitespace-pre-line">{note.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() => {
                      setEditId(note._id);
                      setEditText(note.text);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
