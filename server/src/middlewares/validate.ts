import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      const message = err.errors?.[0]?.message || "Invalid data";
      return next(ApiError.badRequest(message));
    }
};
