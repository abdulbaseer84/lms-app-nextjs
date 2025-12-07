"use client";

import { useEffect, useState } from "react";

export default function Discussions() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [replyText, setReplyText] = useState({});
  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user || null);
    }
    loadUser();
  }, []);

  // Load discussions from DB
  async function loadPosts() {
    const res = await fetch("/api/discussions", { cache: "no-store" });
    const data = await res.json();
    setPosts(data.discussions || []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  // Create a discussion post
  async function addPost() {
    if (!newPost.trim()) return;

    const res = await fetch("/api/discussions", {
      method: "POST",
      body: JSON.stringify({ text: newPost }),
    });

    const data = await res.json();

    if (res.ok) {
      setNewPost("");
      loadPosts(); // reload from DB
    } else {
      alert(data.message);
    }
  }

  // Add reply
  async function addReply(postId) {
    if (!replyText[postId]?.trim()) return;

    const res = await fetch("/api/discussions/reply", {
      method: "POST",
      body: JSON.stringify({
        discussionId: postId,
        text: replyText[postId],
      }),
    });

    if (res.ok) {
      setReplyText({ ...replyText, [postId]: "" });
      loadPosts();
    }
  }

  // Delete discussion
  async function deletePost(postId) {
    if (!confirm("Delete this discussion?")) return;

    const res = await fetch("/api/discussions", {
      method: "DELETE",
      body: JSON.stringify({ id: postId }),
    });

    if (res.ok) loadPosts();
  }

  // Delete reply
  async function deleteReply(postId, replyId) {
    if (!confirm("Delete this reply?")) return;

    const res = await fetch("/api/discussions/reply", {
      method: "DELETE",
      body: JSON.stringify({ discussionId: postId, replyId }),
    });

    if (res.ok) loadPosts();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Discussions</h1>

      {/* NEW POST BOX */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <textarea
          placeholder="Start a discussion..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full border p-3 rounded mb-3"
          rows={3}
        ></textarea>

        <button
          onClick={addPost}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Post
        </button>
      </div>

      {/* NO POSTS */}
      {posts.length === 0 && (
        <p className="text-gray-500">No discussions yet.</p>
      )}

      {/* POSTS */}
      <div className="flex flex-col gap-6">
        {posts.map((p) => (
          <div key={p._id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between">
              <p className="font-medium">{p.text}</p>
              {/* SHOW DELETE IF OWNER OR ADMIN */}
              {user &&
                (user.id === p.userId?._id || user.role === "admin") && (
                  <button
                    onClick={() => deletePost(p._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                )}
            </div>

            <p className="text-xs text-gray-500 mb-3">
              By {p.userId?.name} •{" "}
              {new Date(p.createdAt).toLocaleString()}
            </p>

            {/* REPLIES */}
            <div className="ml-4 border-l pl-4">
              {p.replies.map((r) => (
                <div key={r._id} className="bg-gray-100 p-2 rounded mb-2 text-sm">
                  <div className="flex justify-between">
                    <p>{r.text}</p>

                    {(user?.id === r.userId?._id || user?.role === "admin") && (
                      <button
                        onClick={() => deleteReply(p._id, r._id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    {r.userId?.name} • {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* ADD REPLY */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[p._id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [p._id]: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => addReply(p._id)}
                className="px-3 py-2 bg-green-600 text-white rounded"
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
