import mongoose from "mongoose";

const { Schema, model } = mongoose;

const habitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    habitName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
      default: "daily"
    },
    target: {
      type: Number,
      min: 1,
      default: 1
    },
    streak: {
      type: Number,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

habitSchema.index({ userId: 1, status: 1 });
habitSchema.index({ userId: 1, frequency: 1 });

const Habit = model("Habit", habitSchema);

export default Habit;
