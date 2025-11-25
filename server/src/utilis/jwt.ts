import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { ENV } from "../config/env";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { Types } from "mongoose";

interface JwtPayload {
  id: string;
}

// asccess token expires fast
export const generateAccessToken = (id: string): string => {

    return sign({ id }, ENV.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

// when accesss token expired the refresh token help to generate a new access token. 
export const generateRefreshToken = (id: string): string => {
  return sign({ id }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV !== "development",
    sameSite: "strict",
  });
};

// Issue BOTH tokens + save refresh token in DB (used on login/register)
export const issueTokensForUser = async (
  userId: string | Types.ObjectId,
  res: Response
): Promise<{ accessToken: string }> => {
  const id = userId.toString();

  const accessToken = generateAccessToken(id);
  const refreshToken = generateRefreshToken(id);

  // Save refresh token in DB (for rotation + revoke)
  const decoded = verify(refreshToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload & {
    exp: number;
  };

  await RefreshTokenModel.create({
    user: id,
    token: refreshToken,
    expiresAt: new Date(decoded.exp * 1000),
  });

  setRefreshTokenCookie(res, refreshToken);

  return { accessToken };
};

// Refresh token rotation helper
// every time we used a refresh token to generate a new access token we generate a new refresh token.
export const rotateRefreshToken = async (
  oldToken: string,
  res: Response
): Promise<{ accessToken: string }> => {
  try {
    const decoded = verify(oldToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload & {
      exp: number;
    };

    // 1. Check token exists in DB (rotation & replay protection)
    const existing = await RefreshTokenModel.findOne({ token: oldToken, revoked: false });

    if (!existing) {
      throw new Error("Refresh token not found (possible reuse/replay attack)");
    }

    // 2. Invalidate old token
    existing.revoked = true;
    await existing.save();

    // 3. Create new tokens
    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    const newDecoded = verify(newRefreshToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload & {
      exp: number;
    };

    // 4. Save new refresh token
    await RefreshTokenModel.create({
      user: decoded.id,
      token: newRefreshToken,
      expiresAt: new Date(newDecoded.exp * 1000),
    });

    // 5. Set new cookie
    setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken };
  } catch (err) {
    console.error("Error in rotateRefreshToken:", (err as Error).message);
    throw err;
  }
};

// axios.get("/api/some-protected", {
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//   },
//   withCredentials: true, // so browser sends cookies when needed
// });

