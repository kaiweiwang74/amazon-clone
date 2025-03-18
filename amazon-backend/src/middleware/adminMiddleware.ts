import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { AuthRequest } from "./authMiddleware";

export const verifyAdmin = async (
  req: Request,
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    res.status(403).json({ message: "Unauthorized, please login" });
    return;
  }

  try {
    // Query to check if user is an admin
    const result = await pool.query("SELECT is_admin FROM users WHERE id = $1", [authReq.user.id]);

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      res.status(403).json({ message: "Access denied, admin privileges required" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error while verifying admin status" });
  }
};