"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PrizesEditor from "@/components/admin/PrizesEditor";

const dateFields = [
  { name: "registrationDeadline", label: "Registration Deadline" },
  { name: "startDate", label: "Start Date" },
  { name: "endDate", label: "End Date" },
];
const toISO = (value) => (value ? new Date(value).toISOString() : value);

export default function CreateTournamentDialog({ onClose, onCreated }) {
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    rules: "",
    banner: "",
    format: "",
    maxTeams: "",
    registrationDeadline: "",
    startDate: "",
    endDate: "",
    prizes: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedGame = games.find((game) => game._id === formData.game);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await apiRequest("/games");
        setGames((data.games || []).filter((game) => game.active !== false));
      } catch (err) {
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleGameChange = (event) => {
    setFormData({ ...formData, game: event.target.value, format: "" });
  };

  const validate = () => {
    if (!formData.name.trim()) return "Tournament name is required";
    if (!formData.game) return "Game is required";
    if (!formData.format) return "Format is required";
    if (Number(formData.maxTeams) < 2) return "Max teams must be at least 2";
    if (!formData.registrationDeadline)
      return "Registration deadline is required";
    if (!formData.startDate) return "Start date is required";
    if (!formData.endDate) return "End date is required";
    return "";
  };

  const handleCreate = async () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await apiRequest("/tournaments", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          maxTeams: Number(formData.maxTeams),
          registrationDeadline: toISO(formData.registrationDeadline),
          startDate: toISO(formData.startDate),
          endDate: toISO(formData.endDate),
        }),
      });

      onCreated(data.tournament);
    } catch (err) {
      setError(err.message || "Failed to create tournament");
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create Tournament</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tournament Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Game"
              name="game"
              value={formData.game}
              onChange={handleGameChange}
              fullWidth
            >
              {games.map((game) => (
                <MenuItem key={game._id} value={game._id}>
                  {game.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Banner URL"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              disabled={!formData.game}
              fullWidth
            >
              {(selectedGame?.formats || []).map((format) => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Max Teams"
              name="maxTeams"
              type="number"
              value={formData.maxTeams}
              onChange={handleChange}
              inputProps={{ min: 2 }}
              fullWidth
            />
            {dateFields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type="datetime-local"
                value={formData[field.name]}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            ))}
            <PrizesEditor
              prizes={formData.prizes}
              onChange={(prizes) => setFormData({ ...formData, prizes })}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={saving || loading}
        >
          {saving ? "Creating..." : "Create Tournament"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
