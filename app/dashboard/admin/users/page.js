"use client";

import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load users
  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(data.users || []);
    }
    loadUsers();
  }, []);

// REAL UPDATE (PUT)
const handleSaveRole = async () => {
  const res = await fetch("/api/admin/users", {
    method: "PUT",
    body: JSON.stringify({
      userId: selectedUser._id,
      role: editRole,
    }),
  });

  if (!res.ok) {
    alert("Failed to update role");
    return;
  }

  // Reload users from DB
  const updated = await res.json();
  console.log(updated);

  // Refresh UI
  setUsers((prev) =>
    prev.map((u) =>
      u._id === selectedUser._id ? { ...u, role: editRole } : u
    )
  );

  setSelectedUser(null);
};

// REAL DELETE (DELETE)
const handleDelete = async () => {
  const res = await fetch("/api/admin/users", {
    method: "DELETE",
    body: JSON.stringify({
      userId: confirmDelete._id,
    }),
  });

  if (!res.ok) {
    alert("Failed to delete user");
    return;
  }

  // Update UI
  setUsers((prev) => prev.filter((u) => u._id !== confirmDelete._id));

  setConfirmDelete(null);
};


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm">Name</th>
            <th className="p-3 text-left text-sm">Email</th>
            <th className="p-3 text-left text-sm">Role</th>
            <th className="p-3 text-left text-sm">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>

              <td className="p-3 flex gap-2">
                {/* EDIT BUTTON */}
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setEditRole(u.role);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => setConfirmDelete(u)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ----------------------- EDIT ROLE MODAL ----------------------- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>

            <label className="block text-sm mb-2">Select Role</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------- DELETE CONFIRM MODAL ----------------------- */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>

            <p>Are you sure you want to delete:</p>
            <p className="font-semibold mt-2">{confirmDelete.name}</p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
