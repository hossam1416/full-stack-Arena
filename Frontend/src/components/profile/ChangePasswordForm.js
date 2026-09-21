"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";

export default function ChangePasswordForm({ onDone, onCancel }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // works for every field: the input "name" matches the key in formData
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      onDone(); // the page closes this form and shows a message
    } catch (err) {
      setError(err.message || "Failed to change password");
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
        Change Password
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          fullWidth
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          helperText="Must be at least 6 characters"
          fullWidth
        />
        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Update Password"}
          </Button>
          <Button color="inherit" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
