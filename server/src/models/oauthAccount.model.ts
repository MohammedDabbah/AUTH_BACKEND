import { Schema, model, Document } from "mongoose";

export interface IOAuthAccount extends Document {
  user: Schema.Types.ObjectId; // NO STRING!
  provider: "google";
  providerUserId: string;
}

const OAuthSchema = new Schema<IOAuthAccount>({
  _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: String, required: true },
  providerUserId: { type: String, required: true },
}, { timestamps: true });

export const OAuthAccountModel = model<IOAuthAccount>(
  "OAuthAccount",
  OAuthSchema
);
