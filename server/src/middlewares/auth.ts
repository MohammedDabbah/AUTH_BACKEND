import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiError } from "../errors/ApiError";

interface AccessPayload {
  id: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Access token should come from Authorization header (Bearer <token>)
    const authHeader = req.header("Authorization");

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : undefined;

    if (!token) throw ApiError.unauthorized("No access token provided");

    const decoded = verify(token, ENV.ACCESS_TOKEN_SECRET) as AccessPayload;

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid or expired access token"));
  }
};
