"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  if (user.role === "admin") {
    window.location.href = "/dashboard/admin";
    return null;
  }

  if (user.role === "instructor") {
    window.location.href = "/dashboard/instructor";
    return null;
  }

  window.location.href = "/dashboard/student";
  return null;
}
