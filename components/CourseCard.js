// import Link from "next/link";

// export default function CourseCard({ course }) {
//   return (
//     <div className="bg-white shadow p-4 rounded">
//       <h2 className="text-xl font-bold">{course.title}</h2>
//       <p className="text-gray-600">{course.subtitle}</p>

//       <p className="mt-2 font-semibold">₹{course.price}</p>

//       <Link
//         href={`/course/${course._id}`}
//         className="text-blue-600 mt-3 inline-block"
//       >
//         View Course →
//       </Link>
//     </div>
//   );
// }

import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      
      {/* Thumbnail */}
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
          No Thumbnail
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold">{course.title}</h2>

      {/* Instructor Name */}
      {course.instructor ? (
        <p className="text-gray-600 text-sm">
          Instructor: <span className="font-semibold">{course.instructor.name}</span>
        </p>
      ) : (
        <p className="text-gray-600 text-sm">Instructor: Not Assigned</p>
      )}

      {/* Price */}
      <p className="mt-2 font-semibold">₹{course.price}</p>

      {/* Button */}
      <Link
        href={`/courses/${course._id}`}
        className="text-blue-600 mt-3 inline-block"
      >
        View Course →
      </Link>
    </div>
  );
}
