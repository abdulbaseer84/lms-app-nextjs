import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (responsive) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
