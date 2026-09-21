"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { apiRequest } from "@/lib/api";

// Admin only: enter the score of a match.
export default function EnterResultDialog({ match, onClose, onSubmitted }) {
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (scoreA === "" || scoreB === "") {
      setError("Enter the score of both teams");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(`/matches/${match._id}/result`, {
        method: "PATCH",
        body: JSON.stringify({
          teamA: Number(scoreA),
          teamB: Number(scoreB),
        }),
      });

      onSubmitted();
    } catch (err) {
      setError(err.message || "Failed to submit the result");
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Enter Match Result</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label={match.teamA?.name}
            type="number"
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
            inputProps={{ min: 0 }}
            fullWidth
          />
          <TextField
            label={match.teamB?.name}
            type="number"
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? "Submitting..." : "Submit Result"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
