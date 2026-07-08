import mongoose from "mongoose";

export default async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MongoDB connection skipped:", error.message);
      console.warn("Start MongoDB locally or update MONGODB_URI when database-backed features are added.");
      return;
    }

    throw error;
  }
}
