"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // mobile toggle

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-gray-900 text-white p-2 rounded"
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 overflow-y-auto z-40
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-bold mb-6">LMS Dashboard</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Overview
          </Link>

          {/* STUDENT LINKS */}
          {user.role === "student" && (
            <>
              <Link href="/dashboard/student/my-learning" onClick={() => setOpen(false)}>
                My Learning
              </Link>
              <Link href="/dashboard/student/progress" onClick={() => setOpen(false)}>
                Progress
              </Link>
              <Link href="/dashboard/student/certificates" onClick={() => setOpen(false)}>
                Certificates
              </Link>

              <h3 className="mt-4 text-sm text-gray-400">Learning Tools</h3>
              <Link href="/dashboard/student/discussions" onClick={() => setOpen(false)}>
                Discussions
              </Link>
              <Link href="/dashboard/student/doubts" onClick={() => setOpen(false)}>
                Ask Doubts
              </Link>
              <Link href="/dashboard/student/notes" onClick={() => setOpen(false)}>
                My Notes
              </Link>
              <Link href="/dashboard/student/announcements" onClick={() => setOpen(false)}>
                Announcements
              </Link>

              <h3 className="mt-4 text-sm text-gray-400">Resources</h3>
              <Link href="/dashboard/student/downloads" onClick={() => setOpen(false)}>
                Downloads
              </Link>
              <Link href="/dashboard/student/assignments" onClick={() => setOpen(false)}>
                Assignments
              </Link>
              <Link href="/dashboard/student/tests" onClick={() => setOpen(false)}>
                Tests & Quizzes
              </Link>
            </>
          )}

          {/* INSTRUCTOR LINKS */}
          {user.role === "instructor" && (
            <>
              <h3 className="mt-3 text-sm text-gray-400">Instructor</h3>
              <Link href="/dashboard/instructor/create-course" onClick={() => setOpen(false)}>
                Create Course
              </Link>
              <Link href="/dashboard/instructor/my-courses" onClick={() => setOpen(false)}>
                My Courses
              </Link>
              <Link href="/dashboard/instructor/analytics" onClick={() => setOpen(false)}>
                Analytics
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {user.role === "admin" && (
            <>
              <h3 className="mt-4 text-sm text-gray-400">Admin</h3>

              <Link href="/dashboard/admin/users" onClick={() => setOpen(false)}>
                Users
              </Link>
              <Link href="/dashboard/admin/courses" onClick={() => setOpen(false)}>
                Courses
              </Link>
              <Link href="/dashboard/admin/assign-course" onClick={() => setOpen(false)}>
                Assign Courses
              </Link>
              <Link href="/dashboard/admin/payments" onClick={() => setOpen(false)}>
                Payments
              </Link>
              <Link href="/dashboard/admin/settings" onClick={() => setOpen(false)}>
                Settings
              </Link>

              <h3 className="mt-4 text-sm text-gray-400">Management</h3>
              <Link href="/dashboard/admin/categories" onClick={() => setOpen(false)}>
                Categories
              </Link>
              <Link href="/dashboard/admin/instructors" onClick={() => setOpen(false)}>
                Instructors
              </Link>
              <Link href="/dashboard/admin/reports" onClick={() => setOpen(false)}>
                Reports
              </Link>

              <h3 className="mt-4 text-sm text-gray-400">Site Control</h3>
              <Link href="/dashboard/admin/announcements" onClick={() => setOpen(false)}>
                Announcements
              </Link>
              <Link href="/dashboard/admin/support" onClick={() => setOpen(false)}>
                Support Tickets
              </Link>
              <Link href="/dashboard/admin/site-settings" onClick={() => setOpen(false)}>
                Site Settings
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
