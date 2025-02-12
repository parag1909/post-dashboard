import express from "express";
import {
  createPost,
  getAllPosts,
  getPosts,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";

const postRouter = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Routes
postRouter.post("/", authMiddleware, upload.single("image"), createPost);

postRouter.get("/all", authMiddleware, getAllPosts);

postRouter.get("/", authMiddleware, getPosts);

export default postRouter;
