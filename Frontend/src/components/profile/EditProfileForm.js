"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";

export default function EditProfileForm({ user, games, onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    favoriteGames: user.favoriteGames || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // works for the text fields: the input "name" matches the key in formData
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // add or remove a game from the favorites
  const toggleGame = (gameId) => {
    const favoriteGames = formData.favoriteGames.includes(gameId)
      ? formData.favoriteGames.filter((id) => id !== gameId)
      : [...formData.favoriteGames, gameId];

    setFormData({ ...formData, favoriteGames });
  };

  const handleSave = async () => {
    const username = formData.username.trim();

    if (username.length < 3 || username.length > 15) {
      setError("Username must be between 3 and 15 characters");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...formData, username }),
      });

      onSaved(data.user); // the page updates the user and closes this form
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Edit Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={3}
          inputProps={{ maxLength: 300 }}
          helperText={`${formData.bio.length}/300`}
          fullWidth
        />
        <TextField
          label="Avatar URL"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          fullWidth
        />

        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
            Favorite Games
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {games
              .filter((game) => game.active !== false)
              .map((game) => (
                <Button
                  key={game._id}
                  size="small"
                  variant={
                    formData.favoriteGames.includes(game._id)
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => toggleGame(game._id)}
                >
                  {game.name}
                </Button>
              ))}
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button color="inherit" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
