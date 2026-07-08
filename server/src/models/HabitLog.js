import mongoose from "mongoose";

const { Schema, model } = mongoose;

const habitLogSchema = new Schema(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

habitLogSchema.index({ userId: 1, date: -1 });
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

const HabitLog = model("HabitLog", habitLogSchema);

export default HabitLog;
