import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
// import { generateToken } from "../utilis/generateToken";
import { RegisterDTO, LoginDTO } from "../dtos/user.dto";
import { issueTokensForUser, clearRefreshTokenCookie } from "../utilis/jwt";
import { TokenService } from "../services/token.service";
import { ApiError } from "../errors/ApiError";

const userService = new UserService();
const tokenService = new TokenService();

export const register = async (
    req: Request<{}, {} , RegisterDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.register(req.body);
        
        const { accessToken } = await tokenService.issueTokensForUser(res,
            {
                userId: user?.id  as string 
            })
        
        
        res.status(201).json({
            success: true,
            accessToken,
            user
        });
        
    } catch(err) {
        next(err);
    }
};

export const login = async (
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.login(req.body);

        const { accessToken } = await tokenService.issueTokensForUser(res,
            {
                userId: user?.id  as string 
            });

        res.status(200).json({
        success: true,
        accessToken,
        user
        });
    } catch (err) {
        next(err);
    }
};

// export const logout = (
//     req: Request, 
//     res: Response,
//     next: NextFunction
// ) => {
//   try {
//     const result = userService.logout();

//     res.cookie("token", "" , { 
//         maxAge: 0,
//         httpOnly: true,
//         sameSite: "strict",
//         secure: ENV.NODE_ENV !== "development",
//      });

//     res.json(result);

//   } catch (err) {
//     next(err);
//   }
// };

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldToken = req.cookies?.refreshToken;

    if (oldToken) {
      // Optional: remove from DB
      await import("../models/refreshToken.model").then(async ({ RefreshTokenModel }) => {
        await RefreshTokenModel.deleteOne({ token: oldToken });
      });
    }

    clearRefreshTokenCookie(res);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.findUserById(req.user!.id);
        res.json({ success: true, user });
    } catch(err) {
        next(err);
    }
};

// POST /api/auth/refresh
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldToken = req.cookies?.refreshToken;

    console.log("old..: ",oldToken);

    if (!oldToken) {
      throw ApiError.unauthorized("No refresh token");
    }

    const { accessToken } = await tokenService.rotateRefreshToken(res, { token: oldToken });

    res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired refresh token"));
  }
};


