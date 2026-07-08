import mongoose from "mongoose";

const { Schema, model } = mongoose;

const savingsGoalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    targetAmount: {
      type: Number,
      required: true,
      min: [1, "Target amount must be greater than zero."]
    },
    currentAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    deadline: {
      type: Date
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "General"
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

savingsGoalSchema.index({ userId: 1, status: 1 });
savingsGoalSchema.index({ userId: 1, deadline: 1 });

const SavingsGoal = model("SavingsGoal", savingsGoalSchema);

export default SavingsGoal;
