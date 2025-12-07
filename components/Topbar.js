"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold">Dashboard</h1>

      {user && (
        <div className="flex items-center gap-4">
          <span>{user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
