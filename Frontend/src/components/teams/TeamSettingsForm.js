import { useState } from "react";
import { Alert, Box, Button, Card, Stack, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import TeamFormFields from "@/components/teams/TeamFormFields";

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
    <Card sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
      <Typography variant="h6">TEAM SETTINGS</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your team information and appearance.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TeamFormFields formData={formData} onChange={handleChange} />

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
