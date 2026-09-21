"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";

const emptyGame = {
  name: "",
  description: "",
  logo: "",
  banner: "",
  genre: "",
  formats: [],
};

export default function AdminGamesPage() {
  const [games, setGames] = useState([]);
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState(emptyGame);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // load games and formats when the page opens
  useEffect(() => {
    const loadData = async () => {
      try {
        const [gamesData, formatsData] = await Promise.all([
          apiRequest("/games"),
          apiRequest("/games/formats"),
        ]);

        setGames(gamesData.games || []);
        setFormats(formatsData.formats || []);
      } catch (err) {
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const openAddDialog = () => {
    setEditingGame(null);
    setFormData(emptyGame);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (game) => {
    setEditingGame(game);
    setFormData({
      name: game.name || "",
      description: game.description || "",
      logo: game.logo || "",
      banner: game.banner || "",
      genre: game.genre || "",
      formats: game.formats || [],
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // check / uncheck a format
  const handleFormatToggle = (format) => {
    const newFormats = formData.formats.includes(format)
      ? formData.formats.filter((item) => item !== format)
      : [...formData.formats, format];

    setFormData({ ...formData, formats: newFormats });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setFormError("Game name is required");
      return;
    }

    if (formData.formats.length === 0) {
      setFormError("Please select at least one format");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingGame) {
        const data = await apiRequest(`/games/${editingGame._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        setGames(
          games.map((game) =>
            game._id === editingGame._id ? data.game : game,
          ),
        );
        setMessage("Game updated successfully");
      } else {
        const data = await apiRequest("/games", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        setGames([...games, data.game]);
        setMessage("Game created successfully");
      }

      setDialogOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to save game");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (game) => {
    try {
      setError("");

      const data = await apiRequest(`/games/${game._id}`, {
        method: "PUT",
        body: JSON.stringify({ active: !game.active }),
      });

      setGames(games.map((item) => (item._id === game._id ? data.game : item)));
      setMessage(data.game.active ? "Game activated" : "Game deactivated");
    } catch (err) {
      setError(err.message || "Failed to update game status");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Manage Games"
        subtitle="Create and manage games available on Arena."
        action={
          <Button variant="contained" onClick={openAddDialog}>
            Add Game
          </Button>
        }
      />

      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* games table */}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Formats</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {games.map((game) => (
                <TableRow key={game._id}>
                  <TableCell>
                    <Typography fontWeight={600}>{game.name}</Typography>
                  </TableCell>
                  <TableCell>{game.genre || "—"}</TableCell>
                  <TableCell>{game.formats?.join(", ") || "—"}</TableCell>
                  <TableCell>{game.active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openEditDialog(game)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color={game.active ? "error" : "success"}
                        onClick={() => handleToggleActive(game)}
                      >
                        {game.active ? "Deactivate" : "Activate"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* add / edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingGame ? "Edit Game" : "Add New Game"}</DialogTitle>

        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
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
              rows={3}
              fullWidth
            />
            <TextField
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Banner URL"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              fullWidth
            />

            {/* formats: many checkboxes */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Formats</FormLabel>
              <FormGroup row>
                {formats.map((format) => (
                  <FormControlLabel
                    key={format}
                    label={format}
                    control={
                      <Checkbox
                        checked={formData.formats.includes(format)}
                        onChange={() => handleFormatToggle(format)}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editingGame ? "Update Game" : "Create Game"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* success message */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Container>
  );
}
