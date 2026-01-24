import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
