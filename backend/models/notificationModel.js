import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    message: { type: String },
  },
  {
    timestamps: true,
    expireAfterSeconds: 60 * 60 * 24 * 7, // auto-delete after 7 days
  }
);

export default mongoose.model("Notification", notificationSchema);
