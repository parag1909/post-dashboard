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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://post-dashboard-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

connectDB();
connectCloudinary();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

 