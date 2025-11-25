import { Schema, model, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  user: Types.ObjectId;
  token: string;          // for production you’d hash this
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
});

// Optional index to auto-remove expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
