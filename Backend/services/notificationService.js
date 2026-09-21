import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipient,
  type,
  title,
  message,
  metadata = {},
}) => {
  return await Notification.create({
    recipient,
    type,
    title,
    message,
    metadata,
  });
};
