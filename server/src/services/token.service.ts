import { generateAccessToken, 
    generateRefreshToken, 
    setRefreshTokenCookie, 
 } from "../utilis/jwt";
 import { TokenDTO } from "../dtos/token.dto";
 import { JwtPayload, verify } from "jsonwebtoken";
 import { ENV } from "../config/env";
 import { RefreshTokenModel } from "../models/refreshToken.model";
 import { Response } from "express";

export class TokenService {
    async issueTokensForUser(
        res: Response,
        data: TokenDTO
    ): Promise<{ accessToken: string}> {
        try {

            if (!data.userId) {
                throw new Error("Missing userId for issuing tokens");
            }
            const userId = data.userId?.toString();

            const accessToken = generateAccessToken(userId);
            const refreshToken = generateRefreshToken(userId);

            const decoded = verify(refreshToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload & {
                exp: number
            };

            await RefreshTokenModel.create({
                user: userId,
                token: refreshToken,
                expiresAt: new Date(decoded.exp * 1000),
            });

            setRefreshTokenCookie(res, refreshToken);

            return { accessToken };

        } catch(err) {
            throw Error((err as Error).message);
        }
    };

    async rotateRefreshToken(
        res: Response,
        data: TokenDTO
    ): Promise<{ accessToken: string }> {
        try {
            if (!data.token) {
                throw new Error("Refresh token missing");
            }

            const decoded = verify( data.token , ENV.REFRESH_TOKEN_SECRET) as JwtPayload & {
                exp: number
            };


            const exists = await RefreshTokenModel.findOne({ token: data.token, revoked: false });

            console.log("exi..: ",exists)

            if (!exists) {
                throw new Error("Refresh token not found (possible reuse/replay attack)");
            }

            exists.revoked = true;
            await exists.save();

            return this.issueTokensForUser(res, { userId: decoded.id });

        } catch(err) {
            throw Error((err as Error).message);
        }
    };
};
