import mongoose from "mongoose";

const { Schema, model } = mongoose;

const assetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    type: {
      type: String,
      enum: ["savings", "investment", "asset"],
      required: true,
      index: true
    },
    value: {
      type: Number,
      required: true,
      min: [0, "Asset value cannot be negative."]
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

assetSchema.index({ userId: 1, date: -1 });
assetSchema.index({ userId: 1, type: 1 });

const Asset = model("Asset", assetSchema);

export default Asset;
