// import { sign } from "jsonwebtoken";
// import { Response } from "express";
// import { ENV } from "../config/env";

// export const generateToken = (
//     id: string,
//     res: Response
//     ): string | undefined => {
//     try {
//         const token = sign({ id }, ENV.JWT_SECRET, { expiresIn: "7d" });

//         res.cookie("token", token, {
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
//         secure: ENV.NODE_ENV !== "development",
//         });

//         return token;

//     } catch (err) {
//         console.error("Error generating token:", (err as Error).message);
//         return undefined;
//     }
// };
