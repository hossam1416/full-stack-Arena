"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PrizesEditor from "@/components/admin/PrizesEditor";

const dateFields = [
  { name: "registrationDeadline", label: "Registration Deadline" },
  { name: "startDate", label: "Start Date" },
  { name: "endDate", label: "End Date" },
];

const toDateTimeLocal = (date) => {
  if (!date) return "";

  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());

  return value.toISOString().slice(0, 16);
};

const toISO = (value) => (value ? new Date(value).toISOString() : value);

export default function EditTournamentDialog({ tournament, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: tournament.name || "",
    description: tournament.description || "",
    banner: tournament.banner || "",
    format: tournament.format || "",
    maxTeams: tournament.maxTeams || "",
    registrationDeadline: toDateTimeLocal(tournament.registrationDeadline),
    startDate: toDateTimeLocal(tournament.startDate),
    endDate: toDateTimeLocal(tournament.endDate),
    prizes: tournament.prizes || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formats, setFormats] = useState([]);

  useEffect(() => {
    const loadFormats = async () => {
      try {
        const data = await apiRequest("/games/formats");
        setFormats(data.formats || []);
      } catch (err) {
        setError(err.message || "Failed to load formats");
      }
    };

    loadFormats();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Tournament name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await apiRequest(`/tournaments/${tournament._id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          maxTeams: Number(formData.maxTeams),
          registrationDeadline: toISO(formData.registrationDeadline),
          startDate: toISO(formData.startDate),
          endDate: toISO(formData.endDate),
        }),
      });

      onSaved(data.tournament);
    } catch (err) {
      setError(err.message || "Failed to update tournament");
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Tournament</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tournament Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
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
            fullWidth
          >
            {formats.map((format) => {
              const isAllowed = tournament.game?.formats?.includes(format);

              return (
                <MenuItem key={format} value={format} disabled={!isAllowed}>
                  {format}
                </MenuItem>
              );
            })}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
