import { PostService } from "../services/post.service.js";
import logger from "../config/logger.js";
import { validatePost } from "../validators/post.validator.js";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    const imageFile = req.file;

    // Validate post data
    const validationErrors = validatePost(title, content);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Create post using service
    const post = await PostService.createPost(
      { title, content },
      userId,
      imageFile
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    logger.error(`Post creation controller error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const postsPerPage = 5;

    const result = await PostService.getUserPosts(
      req.user.id,
      page,
      postsPerPage
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error(`Get posts controller error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const postsPerPage = 5;

    const result = await PostService.getAllPosts(page, postsPerPage);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error(`Get all posts controller error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
