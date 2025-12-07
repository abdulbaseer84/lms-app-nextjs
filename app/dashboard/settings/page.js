"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  if (!user) return <p className="text-gray-500 text-sm">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>

      {/* Profile Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Profile Information</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-sm">Name</label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full mt-1 p-2 text-sm border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full mt-1 p-2 text-sm border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full mt-1 p-2 text-sm border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-3">Change Password</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-sm">Current Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 text-sm border rounded"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">New Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 text-sm border rounded"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Confirm New Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 text-sm border rounded"
              placeholder="Re-enter new password"
            />
          </div>

          <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
