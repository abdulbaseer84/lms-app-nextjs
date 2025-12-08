"use client";

import Link from "next/link";
import { useState } from "react";

export default function InstructorSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 bg-blue-600 text-white"
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-5 z-50 
          transform transition-transform 
          ${open ? "translate-x-0" : "-translate-x-64"} 
          md:translate-x-0 md:static`}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Instructor Panel
        </h2>

        <nav className="flex flex-col space-y-4">

          <Link href="/dashboard/instructor" onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          <Link href="/dashboard/instructor/courses" onClick={() => setOpen(false)}>
            My Courses
          </Link>

          <Link href="/dashboard/instructor/students" onClick={() => setOpen(false)}>
            Students
          </Link>

          {/* 🔥 Your requested link */}
          <Link
            href="/dashboard/instructor/analytics"
            onClick={() => setOpen(false)}
          >
            Analytics
          </Link>

          <Link href="/logout" onClick={() => setOpen(false)}>
            Logout
          </Link>
        </nav>
      </div>
    </>
  );
}
