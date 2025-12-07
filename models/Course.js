import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    category: { type: String },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    lessons: [
      {
        title: String,
        videoUrl: String,
        duration: String,
      }
    ],

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
