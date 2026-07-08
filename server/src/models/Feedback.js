import mongoose from "mongoose";

const { Schema, model } = mongoose;

const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Feedback message must be at least 5 characters long."],
      maxlength: [1000, "Feedback message cannot exceed 1000 characters."]
    },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "closed"],
      default: "open",
      index: true
    }
  },
  {
    timestamps: true
  }
);

feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;
