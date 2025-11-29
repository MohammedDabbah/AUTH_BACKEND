import { Request, Response } from "express";
import { GoogleOAuthService } from "../services/googleOAuth.service";
import { TokenService } from "../services/token.service";
import { ApiError } from "../errors/ApiError";

const googleService = new GoogleOAuthService();
const tokenService = new TokenService();

// GET /auth/google
export const googleAuth = (req: Request, res: Response) => {
  const url = googleService.getAuthURL();
  return res.redirect(url);
};

// GET /auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ error: "Missing Google code" });

    // 1) Exchange code -> tokens
    const tokens = await googleService.exchangeCodeForTokens(code);

    // 2) Fetch Google user info
    const googleUser = await googleService.fetchGoogleUser(tokens.access_token);

    // 3) Sync Google user with your DB
    const user = await googleService.findOrCreateUser(googleUser) as any;

    // SAFETY CHECK
    if (!user) {
      console.error("OAuth Error: user returned null from findOrCreateUser");
      throw ApiError.internal("OAuth failed: could not create or find user");
    }

    // 4) Generate YOUR JWT + Refresh token
    const { accessToken } = await tokenService.issueTokensForUser(res, {
      userId: user?._id as string,
    });

    // 5) Return success response
    return res.json({
      success: true,
      message: "Logged in with Google",
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

  } catch (err: any) {
    console.error("Google OAuth Error:", err.message);
    return res.status(500).json({ error: "OAuth login failed" });
  }
};
