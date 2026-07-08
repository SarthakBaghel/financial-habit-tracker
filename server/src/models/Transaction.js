import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative."]
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, category: 1 });

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
