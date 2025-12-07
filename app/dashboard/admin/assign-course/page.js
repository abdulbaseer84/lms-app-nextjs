"use client";

import { useEffect, useState } from "react";

export default function AssignCourse() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignedList, setAssignedList] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Load Users, Courses & Assigned Courses
  useEffect(() => {
    async function loadData() {
      // Load users
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      setUsers(userData.users.filter((u) => u.role === "student"));

      // Load courses
      const courseRes = await fetch("/api/admin/courses", { cache: "no-store" });
      const courseData = await courseRes.json();
      setCourses(courseData.courses || []);

      // Load assigned courses
      const assignedRes = await fetch("/api/admin/assign-course", { cache: "no-store" });
      const assignedData = await assignedRes.json();
      setAssignedList(assignedData.assigned || []);
    }

    loadData();
  }, []);

  // Assign Course
  async function assignCourse() {
    if (!selectedUser || !selectedCourse) {
      alert("Please select student & course");
      return;
    }

    const res = await fetch("/api/admin/assign-course", {
      method: "POST",
      body: JSON.stringify({
        studentId: selectedUser,
        courseId: selectedCourse,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Course Assigned Successfully!");

    // Reload list
    const assignedRes = await fetch("/api/admin/assign-course");
    const assignedData = await assignedRes.json();
    setAssignedList(assignedData.assigned || []);
  }

  // Delete Assigned
  async function deleteAssigned(id) {
    if (!confirm("Are you sure?")) return;

    const res = await fetch("/api/admin/assign-course", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Assignment removed!");

    // Reload list
    const assignedRes = await fetch("/api/admin/assign-course");
    const assignedData = await assignedRes.json();
    setAssignedList(assignedData.assigned || []);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assign Course to Student</h1>

      {/* Select Student */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Student</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Choose Student --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Select Course */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Course</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Choose Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Button */}
      <button
        onClick={assignCourse}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Assign Course
      </button>

      {/* Assigned List */}
      <h2 className="text-xl font-bold mt-10 mb-4">Assigned Courses</h2>

      {assignedList.length === 0 ? (
        <p className="text-gray-500">No courses assigned yet.</p>
      ) : (
        <table className="w-full bg-white shadow rounded mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignedList.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.student?.name}</td>
                <td className="p-3">{item.course?.title}</td>

                <td className="p-3">
                  <button
                    onClick={() => deleteAssigned(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
