"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "My Courses", path: "/dashboard/courses" },
  { title: "Progress", path: "/dashboard/progress" },
  { title: "Certificates", path: "/dashboard/certificates" },
  { title: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

      <nav className="flex flex-col gap-4">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.path}
            className={`p-3 rounded-lg font-medium ${
              pathname === link.path
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
