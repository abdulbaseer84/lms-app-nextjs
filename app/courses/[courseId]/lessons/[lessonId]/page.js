async function getLesson(courseId, lessonId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/courses/${courseId}/lessons`
  );
  const data = await res.json();
  return data.lessons.find((l) => l._id === lessonId);
}

export default async function LessonPage({ params }) {
  const lesson = await getLesson(params.courseId, params.lessonId);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{lesson.title}</h1>

      {lesson.videoUrl && (
        <video
          controls
          className="mt-6 w-full max-w-3xl"
          src={lesson.videoUrl}
        />
      )}

      <p className="mt-6 text-gray-700">{lesson.content}</p>
    </div>
  );
}
