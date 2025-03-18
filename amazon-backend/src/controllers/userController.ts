import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import pool from "../config/db";
import exp from "constants";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "Email has been register" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, hashedPassword]);

      res.status(200).json({ message: "Sign up succeed", user: newUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      res.status(401).json({ message: "Account or password fail" });
      return;
    }    

    const hashedPassword = user.rows[0]?.password;
    if (!hashedPassword) {
      res.status(500).json({ message: "System error, user password not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      res.status(401).json({ message: "Account or password fail" });
      return;
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h"
    });

    res.json({ message: "Sign in succeed", token });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message: "Server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const user = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);

      if (user.rows.length === 0) {
        res.status(404).json({ message: "User not exist" });
      }

      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error? error.message: "Server error" });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      res.status(404).json({ message: "User not exist" });
    }

    let hashedPassword = user.rows[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email",
      [name || user.rows[0].name, email || user.rows[0].email, hashedPassword, userId]
    )

    res.json({ message: "User information updated", user: updatedUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
  }
}
