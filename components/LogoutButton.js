"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <button
      onClick={logout}
      className="w-full text-left px-4 py-2 hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
