import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appEnv } from "../config/env";

interface JwtPayload {
  id: string;
  email:string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,appEnv.jwt.accessSecret) as JwtPayload;
    (req as any).user = { id: decoded.id,email:decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
