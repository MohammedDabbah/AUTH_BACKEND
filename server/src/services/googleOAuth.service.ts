import axios, { AxiosError } from "axios";
import { ApiError } from "../errors/ApiError";
import { OAuthAccountModel } from "../models/oauthAccount.model";
import { UserModel } from "../models/user.model";

export class GoogleOAuthService {

  getAuthURL() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: ["openid", "profile", "email"].join(" "),
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string) {
    try {
        const res = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        
        return res.data;

    } catch (err) {
        throw ApiError.serviceUnavailable((err as Error).message);
    }
  };

  async fetchGoogleUser(accessToken: string) {
    try {
        const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        return res.data;
    } catch(err) {
        throw ApiError.serviceUnavailable((err as Error).message);
    }
  };

  async findOrCreateUser(googleUser: any) {
    // 1) Does OAuth account already exist?
    const existingOAuth = await OAuthAccountModel.findOne({
      provider: "google",
      providerUserId: googleUser.sub,
    }).populate("user");

    if (existingOAuth) {
      return existingOAuth.user; // return real DB user
    }

    // 2) Does a user with same email exist?
    let user = await UserModel.findOne({ email: googleUser.email });

    // 3) If not, create user without password
    if (!user) {
      user = await UserModel.create({
        name: googleUser.name,
        email: googleUser.email,
        authProvider: "google",
        password: null, // Google accounts do not have password
      });
    }

    // 4) Create OAuth account record
    await OAuthAccountModel.create({
      _id: user._id,
      provider: "google",
      providerUserId: googleUser.sub,
    });

    return user;
  }
}
