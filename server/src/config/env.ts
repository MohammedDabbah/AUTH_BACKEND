import { config } from "dotenv";

config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    NODE_ENV: process.env.NODE_ENV || "",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_secret",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? "15m",
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
};