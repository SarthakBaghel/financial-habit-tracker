import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const port = process.env.PORT || 5001;

const startServer = async () => {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start API server:", error.message);
  process.exit(1);
});
