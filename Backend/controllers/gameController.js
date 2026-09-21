import Game from "../models/Game.js";
import slugify from "slugify";
import { GAME_FORMATS } from "../constants/formats.js";

export const createGame = async (req, res) => {
  try {
    let { name, description, logo, banner, genre, formats } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Game name is required" });
    }

    name = name.trim();

    if (formats !== undefined) {
      if (!Array.isArray(formats)) {
        return res.status(400).json({ message: "Formats must be an array" });
      }
      const validFormats = Object.keys(GAME_FORMATS);
      const hasInvalidFormat = formats.some((f) => !validFormats.includes(f));
      if (hasInvalidFormat) {
        return res
          .status(400)
          .json({ message: "Invalid game format provided" });
      }
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingGame = await Game.findOne({ slug });
    if (existingGame) {
      return res
        .status(400)
        .json({ message: "Game name or slug already exists" });
    }

    const game = await Game.create({
      name,
      slug,
      description,
      logo,
      banner,
      genre,
      formats,
    });

    res.status(201).json({ message: "Game created successfully", game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.find();

    res.status(200).json({
      games,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.status(200).json({
      game,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, logo, banner, genre, formats, active } = req.body;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (formats !== undefined) {
      if (!Array.isArray(formats)) {
        return res.status(400).json({ message: "Formats must be an array" });
      }
      const validFormats = Object.keys(GAME_FORMATS);
      const hasInvalidFormat = formats.some((f) => !validFormats.includes(f));
      if (hasInvalidFormat) {
        return res
          .status(400)
          .json({ message: "Invalid game format provided" });
      }
    }

    if (name !== undefined) {
      name = name.trim();
      const slug = slugify(name, { lower: true, strict: true });

      const existingGame = await Game.findOne({ name, _id: { $ne: id } });
      if (existingGame) {
        return res
          .status(400)
          .json({ message: "Game name or slug already exists" });
      }

      game.name = name;
      game.slug = slug;
    }

    if (description !== undefined) game.description = description;
    if (logo !== undefined) game.logo = logo;
    if (banner !== undefined) game.banner = banner;
    if (genre !== undefined) game.genre = genre;
    if (formats !== undefined) game.formats = formats;
    if (active !== undefined) game.active = active;

    await game.save();

    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getGameFormats = async (req, res) => {
  try {
    res.status(200).json({
      formats: Object.keys(GAME_FORMATS),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
