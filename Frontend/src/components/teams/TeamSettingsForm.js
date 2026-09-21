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

// The form keeps its own state, so the page reloading (accept a request, remove a member)
// does not erase what the captain is typing.
export default function TeamSettingsForm({ team, onSaved }) {
  const [formData, setFormData] = useState({
    name: team.name || "",
    description: team.description || "",
    logo: team.logo || "",
    banner: team.banner || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // works for every field: the input "name" matches the key in formData
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Team name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(`/teams/${team._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          logo: formData.logo.trim() || null,
          banner: formData.banner.trim() || null,
        }),
      });

      onSaved(); // the page shows a message and loads the team again
    } catch (err) {
      setError(err.message || "Failed to update team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 900, letterSpacing: "0.04em" }}
      >
        TEAM SETTINGS
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.9rem" }}>
        Update your team information and appearance.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Team Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Team Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            minRows={4}
            inputProps={{ maxLength: 300 }}
            helperText={`${formData.description.length}/300`}
            fullWidth
          />
          <TextField
            label="Team Logo URL"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/team-logo.png"
            fullWidth
          />
          <TextField
            label="Team Banner URL"
            name="banner"
            value={formData.banner}
            onChange={handleChange}
            placeholder="https://example.com/team-banner.jpg"
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, px: 3 }}
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
