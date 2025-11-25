import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err.message);

    const status = err.status || 500;

    res.status(status).json(
        {
            success: false,
            message: err.message || "Server error"
        }
    );
};