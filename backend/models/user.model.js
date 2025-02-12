import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    indexes: [
      { unique: true, fields: ["username"] },
      { unique: true, fields: ["email"] },
    ],
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
