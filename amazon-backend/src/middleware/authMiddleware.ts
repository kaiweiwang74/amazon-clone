import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface DecodedToken extends JwtPayload {
  id: number;
  is_admin?: boolean;
}

export interface AuthRequest extends Request {
  user?: DecodedToken; // Make sure user matches DecodedToken type
}

export const verifyToken = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  const token = authReq.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized, please provide a JWT Token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;
    authReq.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
