import mongoose from "mongoose";

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Database is already connected");
      return;
    }

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(dbUri);

    console.log("Connected to the database successfully");
    return;
  } catch (err: any) {
    console.error("Error while connecting to the database:", err?.message);
    throw new Error("Failed to connect to Database");
  }
}
