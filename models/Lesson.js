import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    position: { type: Number, default: 0 }, // sorting order
  },
  { timestamps: true }
);

export default mongoose.models.Lesson ||
  mongoose.model("Lesson", lessonSchema);
