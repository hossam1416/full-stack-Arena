import Announcement from "../models/Announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, image, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }
    const announcement = await Announcement.create({
      title,
      content,
      image: image || null,
      published: published || false,
      createdBy: req.user._id,
    });
    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAnnouncements = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { published: true };
    const announcements = await Announcement.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id).populate(
      "createdBy",
      "username",
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (!announcement.published && req.user.role !== "admin") {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }
    const { title, content, image, published } = req.body;

    if (title !== undefined) {
      announcement.title = title;
    }
    if (content !== undefined) {
      announcement.content = content;
    }
    if (image !== undefined) {
      announcement.image = image;
    }
    if (published !== undefined) {
      announcement.published = published;
    }
    await announcement.save();

    res.status(200).json({
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }
    await announcement.deleteOne();
    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
