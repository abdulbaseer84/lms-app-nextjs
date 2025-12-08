"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [editCourse, setEditCourse] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
    level: "",
    price: 0,
    thumbnail: "",
  });

  /* LOAD COURSES */
  async function loadCourses() {
    const res = await fetch("/api/courses", { cache: "no-store" });
    const data = await res.json();
    setCourses(data.courses || []);
    setFiltered(data.courses || []);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  /* SEARCH + FILTER + SORT */
  useEffect(() => {
    let data = [...courses];

    if (search.trim() !== "") {
      data = data.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterLevel !== "") {
      data = data.filter((c) => c.level === filterLevel);
    }

    if (filterCategory !== "") {
      data = data.filter((c) =>
        c.category?.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    if (sortBy === "price_low") data.sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") data.sort((a, b) => b.price - a.price);
    if (sortBy === "title_az") data.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "title_za") data.sort((a, b) => b.title.localeCompare(a.title));

    setFiltered(data);
  }, [search, filterLevel, filterCategory, sortBy, courses]);

  /* ADD COURSE */
  async function handleAddCourse() {
    const res = await fetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(newCourse),
    });

    if (res.ok) {
      setShowAddModal(false);
      setNewCourse({
        title: "",
        category: "",
        level: "",
        price: 0,
        thumbnail: "",
      });
      loadCourses();
    }
  }

  /* EDIT COURSE */
  async function handleSaveEdit() {
    const res = await fetch("/api/courses", {
      method: "PUT",
      body: JSON.stringify(editCourse),
    });

    if (res.ok) {
      setEditCourse(null);
      loadCourses();
    }
  }

  /* DELETE COURSE */
  async function handleDelete() {
    const res = await fetch("/api/courses", {
      method: "DELETE",
      body: JSON.stringify({ id: confirmDelete._id }),
    });

    if (res.ok) {
      setConfirmDelete(null);
      loadCourses();
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Course
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Search course..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Filter category..."
          className="border p-2 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
        >
          <option value="">Filter by Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="title_az">Title: A → Z</option>
          <option value="title_za">Title: Z → A</option>
        </select>
      </div>

      {/* CARD VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border"
          >
            {c.thumbnail ? (
              <img
                src={c.thumbnail}
                alt={c.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h3 className="text-lg font-semibold">{c.title}</h3>

            <p className="text-sm text-gray-600 mt-1">
              Category: <span className="font-medium">{c.category}</span>
            </p>

            <p className="text-sm text-gray-600">
              Level: <span className="capitalize font-medium">{c.level}</span>
            </p>

            <p className="mt-2 font-bold text-blue-600">₹ {c.price}/-</p>

            {/* BUTTONS */}
            <div className="flex flex-col gap-2 mt-4">

              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm w-full"
                onClick={() => setEditCourse({ ...c })}
              >
                Edit
              </button>

              <button
                className="px-3 py-1 bg-red-600 text-white rounded text-sm w-full"
                onClick={() => setConfirmDelete(c)}
              >
                Delete
              </button>

              {/* NEW — Add Lesson */}
              <button
                className="px-3 py-1 bg-green-600 text-white rounded text-sm w-full"
                onClick={() => router.push(`/dashboard/admin/courses/${c._id}/lessons`)}
              >
                + Add Lesson
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <AddEditCourseModal
          mode="add"
          course={newCourse}
          setCourse={setNewCourse}
          close={() => setShowAddModal(false)}
          save={handleAddCourse}
        />
      )}

      {/* EDIT MODAL */}
      {editCourse && (
        <AddEditCourseModal
          mode="edit"
          course={editCourse}
          setCourse={setEditCourse}
          close={() => setEditCourse(null)}
          save={handleSaveEdit}
        />
      )}

      {/* DELETE MODAL */}
      {confirmDelete && (
        <DeleteModal
          item={confirmDelete.title}
          close={() => setConfirmDelete(null)}
          remove={handleDelete}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------
   ADD / EDIT COURSE MODAL
---------------------------------------------------- */
function AddEditCourseModal({ mode, course, setCourse, close, save }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add New Course" : "Edit Course"}
        </h2>

        <input
          placeholder="Title"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="border p-2 w-full rounded mb-3"
        />

        <input
          placeholder="Category"
          value={course.category}
          onChange={(e) => setCourse({ ...course, category: e.target.value })}
          className="border p-2 w-full rounded mb-3"
        />

        <select
          value={course.level}
          onChange={(e) => setCourse({ ...course, level: e.target.value })}
          className="border p-2 w-full rounded mb-3"
        >
          <option value="">Select Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <input
          placeholder="Price"
          type="number"
          value={course.price}
          onChange={(e) => setCourse({ ...course, price: e.target.value })}
          className="border p-2 w-full rounded mb-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            if (data.url) {
              setCourse({ ...course, thumbnail: data.url });
            }
          }}
          className="border p-2 w-full rounded mb-3"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   DELETE MODAL
---------------------------------------------------- */
function DeleteModal({ item, close, remove }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Delete</h2>

        <p>Delete course:</p>
        <p className="font-semibold">{item}</p>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={remove}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
