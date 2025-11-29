import { CreateUserDTO } from "../dtos/user.dto";
import { hash, compare } from "bcryptjs";
import { IUser, UserModel } from "../models/user.model";
import { RegisterDTO, LoginDTO } from "../dtos/user.dto";
import { ApiError } from "../errors/ApiError";
import { AuthUser } from "../types/auth.types";

export class UserService {
    async createUser(data: CreateUserDTO): Promise<object> {
        return {
            name: data.name,
            email: data.email
        };
    }

    async register(data: RegisterDTO): Promise<AuthUser | undefined> {
        try {
            const existing = await UserModel.findOne({ email: data.email});
            if(existing) throw ApiError.badRequest("Email already registered");

            const hashedPassword = await hash(data.password, 10);

            const user = await UserModel.create({
                name: data.name,
                email: data.email,
                password: hashedPassword
            });
            return {
                id: user._id,
                name: user.name,
                email: user.email
            };
        } catch(err) {
            console.error("Error in register service: ", (err as Error).message);
            throw ApiError.badRequest((err as Error).message);
        }
    }

    async login(data: LoginDTO): Promise<AuthUser | undefined> {
        try {
             const user = await UserModel.findOne({ email: data.email });
            if (!user) throw ApiError.unauthorized("Invalid email or password");

            if(user.authProvider === "google")
                throw ApiError.forbidden("This account uses Google Login. Please login with Google.")

            const match = await compare(data.password, user.password!);
            if (!match) throw ApiError.unauthorized("Invalid email or password");
            
            return {
                id: user._id,
                name: user.name,
                email: user.email
            };
        } catch(err) {
            console.error("Error in register service: ", (err as Error).message);
            throw ApiError.badRequest((err as Error).message);
        }
    }

    logout() {
        return { 
            success: true, 
            message: "Logged out successfully" 
        };
    }

    async findUserById (id: string): Promise<IUser | undefined> {
        try {
            const user = await UserModel.findById(id).select("-password");
            if(!user) throw ApiError.notfound("User not found");

            return user;
        } catch(err) {
            throw ApiError.badRequest((err as Error).message);
        }
    }
};