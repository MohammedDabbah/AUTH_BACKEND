import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  authProvider: "local" | "google";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    // ⬇️ password is NOT required here
    password: { type: String, default: null },
    
    authProvider: { 
      type: String, 
      enum: ["local", "google"], 
      required: true, 
      default: "local" 
    },
  },
  { timestamps: true }
);

// ✔️ Now we enforce password ONLY for local accounts
userSchema.pre("validate", function (this: IUser, next) {
  if (this.authProvider === "local" && !this.password) {
    return next(new Error("Password is required for local accounts"));
  }
  next();
});

export const UserModel = model<IUser>("User", userSchema);
