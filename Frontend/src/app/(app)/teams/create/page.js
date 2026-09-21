"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { apiRequest } from "@/lib/api";

export default function CreateTeamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    logo: "",
    banner: "",
  });
  const [games, setGames] = useState([]);
  const [gameTouched, setGameTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gamesError, setGamesError] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiRequest("/games");
        setGames(data.games || []);
        setGamesError(false);
      } catch (error) {
        console.error("Failed to fetch games:", error);
        setGamesError(true);
      }
    };

    fetchGames();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedLogo = formData.logo.trim();
    const trimmedBanner = formData.banner.trim();

    setGameTouched(true);

    if (!trimmedName || !formData.game) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await apiRequest("/teams", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          game: formData.game,
          description: trimmedDescription,
          logo: trimmedLogo || null,
          banner: trimmedBanner || null,
        }),
      });

      router.push(`/teams/${data.team._id}`);
    } catch (error) {
      console.error("Failed to create team:", error);

      setSubmitError(
        error.message || "Failed to create team. Please try again.",
      );

      setSubmitting(false);
    }
  };

  const gameMissing = gameTouched && !formData.game;
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "background.default",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="md">
        {/* back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          BACK TO TEAMS
        </Button>

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: "background.paper",
            border: "1px solid rgba(156, 163, 175, 0.12)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            CREATE TEAM
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              mb: 4,
            }}
          >
            Build your squad and get ready to enter the arena.
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          {gamesError && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Failed to load games list. Please refresh the page.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="name"
                label="Team Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <Select
                name="game"
                value={formData.game}
                onChange={(event) => {
                  handleChange(event);
                  setGameTouched(true);
                }}
                onBlur={() => setGameTouched(true)}
                displayEmpty
                fullWidth
                error={gameMissing}
              >
                <MenuItem value="" disabled>
                  Select a game
                </MenuItem>

                {games.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {gameMissing && (
                <Typography color="error" sx={{ mt: -2, fontSize: "0.75rem" }}>
                  Please select a game.
                </Typography>
              )}

              <TextField
                name="description"
                label="Team Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
                inputProps={{ maxLength: 300 }}
                helperText={`${formData.description.length}/300`}
              />

              <TextField
                name="logo"
                label="Team Logo URL"
                value={formData.logo}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/team-logo.png"
              />

              <TextField
                name="banner"
                label="Team Banner URL"
                value={formData.banner}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/team-banner.png"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  fontWeight: 800,
                  py: 1.3,
                  boxShadow: "0 0 18px rgba(220, 38, 38, 0.25)",
                }}
              >
                {submitting ? "CREATING..." : "CREATE TEAM"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
