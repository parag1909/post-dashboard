import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import logger from "./config/logger.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

connectDB();
connectCloudinary();

// Routes
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
