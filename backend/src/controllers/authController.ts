import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import generateToken from "../utils/generateToken";

import {
  validateRegisterData,
} from "../validators/authValidator";

// ========================================
// REGISTER USER
// ========================================

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      res.status(400).json({
        message:
          "Name, email and password are required",
      });

      return;
    }

    // Validate registration data
    const validationError =
      validateRegisterData(
        name,
        email,
        password
      );

    if (validationError) {
      res.status(400).json({
        message: validationError,
      });

      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists",
      });

      return;
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ========================================
// LOGIN USER
// ========================================

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      res.status(400).json({
        message:
          "Email and password are required",
      });

      return;
    }

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(401).json({
        message:
          "Invalid email or password",
      });

      return;
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      res.status(401).json({
        message:
          "Invalid email or password",
      });

      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Send response
    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};