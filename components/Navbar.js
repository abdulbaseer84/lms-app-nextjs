"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // user dropdown
  const menuRef = useRef(null);

  // Load logged-in user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
    loadUser();
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // use client-side navigation or plain redirect
    window.location.href = "/";
  }

  return (
    <nav className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-blue-600">
          LMS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/courses" className="hover:text-blue-600">Courses</Link>
          {user && (
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          )}
          {/* If NOT logged in → Show Login/Register */}
          {!user && (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Register
              </Link>
            </>
          )}

          {/* If Logged in → show dropdown (click to open) */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <span className="font-semibold">{user.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow rounded z-50">
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className=" bg-red-500 text-white w-full text-left px-4 py-2 hover:bg-red-600 mt-2 rounded-b"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg flex flex-col p-6 gap-4">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/courses" onClick={() => setOpen(false)}>Courses</Link>

          {!user && (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className=" bg-red-500 px-4 py-2 text-left hover:bg-red-600 text-white rounded text-center w-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
