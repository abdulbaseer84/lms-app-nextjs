import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold">{course.title}</h2>
      <p className="text-gray-600">{course.subtitle}</p>

      <p className="mt-2 font-semibold">₹{course.price}</p>

      <Link
        href={`/course/${course._id}`}
        className="text-blue-600 mt-3 inline-block"
      >
        View Course →
      </Link>
    </div>
  );
}
