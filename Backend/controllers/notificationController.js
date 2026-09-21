import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      // sort notifications by newest first
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user._id,
    });
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        read: false,
      },
      {
        read: true,
      },
    );
    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
