import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import logger from "../config/logger.js";

export class UserService {
  static async createUser(userData) {
    const { username, email, password } = userData;

    try {
      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("Email already in use");
        }
        if (existingUser.username === username) {
          throw new Error("Username already in use");
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      const user = await newUser.save();

      // Log user registration
      logger.info(`User registered: ${username} (${email})`);

      return user;
    } catch (error) {
      logger.error(`User registration error: ${error.message}`);
      throw error;
    }
  }

  static async authenticateUser(username, password) {
    try {
      // Find user by username
      const user = await UserModel.findOne({ username });
      if (!user) {
        logger.warn(`Login attempt for non-existent user: ${username}`);
        throw new Error("User not found");
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Failed login attempt for user: ${username}`);
        throw new Error("Invalid credentials");
      }

      // Log successful login
      logger.info(`User logged in: ${username}`);

      // Generate token
      return this.generateToken(user);
    } catch (error) {
      logger.error(`User authentication error: ${error.message}`);
      throw error;
    }
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }
}
