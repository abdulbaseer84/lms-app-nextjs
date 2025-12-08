import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },

    title: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },

    // Subtopics are objects
    subtopics: [
      {
        title: { type: String, required: true },
        videoUrl: { type: String, default: "" }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
