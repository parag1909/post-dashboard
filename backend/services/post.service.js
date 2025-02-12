import PostModel from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../config/logger.js";
import { Readable } from "stream";

export class PostService {
  static async uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
      const writeStream = cloudinary.uploader.upload_stream(
        { folder: "posts", resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      const readStream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });

      readStream.pipe(writeStream);
    });
  }

  static async createPost(postData, userId, imageFile) {
    try {
      // Handle image upload if provided
      let imageUrl = null;
      if (imageFile) {
        const uploadResponse = await this.uploadToCloudinary(imageFile.buffer);
        imageUrl = uploadResponse.secure_url;
      }

      // Create and save new post
      const newPost = new PostModel({
        title: postData.title,
        content: postData.content,
        author: userId,
        image: imageUrl,
      });

      console.log("NEw post -------->>>", newPost);
      const savedPost = await newPost.save();
      await savedPost.populate("author", "username name");

      return savedPost;
    } catch (error) {
      logger.error(`Post creation error: ${error.message}`);
      throw error;
    }
  }

  static async getAllPosts(page = 1, postsPerPage = 5) {
    try {
      const pageNum = Math.max(1, parseInt(page));
      const skip = (pageNum - 1) * postsPerPage;

      const totalPosts = await PostModel.countDocuments();

      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(postsPerPage)
        .populate("author", "username name");

      return {
        posts,
        currentPage: pageNum,
        totalPosts,
        totalPages: Math.ceil(totalPosts / postsPerPage),
        hasNextPage: skip + postsPerPage < totalPosts,
        hasPreviousPage: pageNum > 1,
      };
    } catch (error) {
      logger.error(`Fetching all posts error: ${error.message}`);
      throw error;
    }
  }

  static async getUserPosts(userId, page = 1, postsPerPage = 5) {
    try {
      const pageNum = Math.max(1, parseInt(page));
      const skip = (pageNum - 1) * postsPerPage;

      const totalPosts = await PostModel.countDocuments({ author: userId });

      const posts = await PostModel.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(postsPerPage)
        .populate("author", "username name");

      return {
        posts,
        currentPage: pageNum,
        totalPosts,
        totalPages: Math.ceil(totalPosts / postsPerPage),
        hasNextPage: skip + postsPerPage < totalPosts,
        hasPreviousPage: pageNum > 1,
      };
    } catch (error) {
      logger.error(`Fetching user-specific posts error: ${error.message}`);
      throw error;
    }
  }
}
 