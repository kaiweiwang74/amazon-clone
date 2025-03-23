import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  findUserById,
  getRawUserById,
  updateUser
} from "../models/userModel";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await findUserByEmail(email);
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "Email has been registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword);

    res.status(200).json({ message: "Sign up succeeded", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (user.rows.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const hashedPassword = user.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ message: "Sign in succeeded", token });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await findUserById(userId);

    if (user.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, email, password } = req.body;

    const user = await getRawUserById(userId);
    if (user.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let hashedPassword = user.rows[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await updateUser(
      userId,
      name || user.rows[0].name,
      email || user.rows[0].email,
      hashedPassword
    );

    res.json({ message: "User profile updated", user: updatedUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
  }
};
