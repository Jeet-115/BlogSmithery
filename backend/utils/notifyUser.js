import Notification from "../models/notificationModel.js";

export const notifyUser = async ({ recipient, type, message, post = null }) => {
  try {
    await Notification.create({
      recipient,
      type,
      message,
      post,
    });
  } catch (err) {
    console.error("Notification error:", err);
  }
};
