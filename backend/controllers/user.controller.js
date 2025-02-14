import { UserService } from "../services/user.service.js";
import {
  validateRegistration,
  validateLogin,
} from "../validators/user.validator.js";
import logger from "../config/logger.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const validationErrors = validateRegistration(
      username,
      email,
      password,
      confirmPassword
    );

    if (validationErrors.length > 0) {
      logger.warn(
        `Registration validation errors: ${validationErrors.join(", ")}`
      );
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    const user = await UserService.createUser({
      username,
      email,
      password,
    });

    const token = UserService.generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validationErrors = validateLogin(username, password);
    if (validationErrors.length > 0) {
      logger.warn(`Login validation errors: ${validationErrors.join(", ")}`);
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    const token = await UserService.authenticateUser(username, password);

    res.json({
      success: true,
      message: "User logged in successfully",
      token,
      username,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
