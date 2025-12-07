async function getLessons(courseId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/courses/${courseId}/lessons`);
  const data = await res.json();
  return data.lessons;
}

export default async function CurriculumPage({ params }) {
  const lessons = await getLessons(params.courseId);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Course Curriculum</h1>

      <ul className="flex flex-col gap-4">
        {lessons.map((lesson) => (
          <li
            key={lesson._id}
            className="p-4 bg-white shadow rounded flex justify-between"
          >
            <div>
              <h2 className="text-lg font-bold">{lesson.title}</h2>
              <p className="text-gray-600">{lesson.content?.slice(0, 100)}...</p>
            </div>

            <a
              href={`/course/${params.courseId}/lessons/${lesson._id}`}
              className="text-blue-600"
            >
              View →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
