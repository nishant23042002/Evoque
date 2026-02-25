import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "customer"],
      default: "customer"
    },
    isBlocked: { type: Boolean, default: false },

  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
