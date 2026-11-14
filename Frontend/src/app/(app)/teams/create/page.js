"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import BackButton from "@/components/common/BackButton";
import TeamFormFields from "@/components/teams/TeamFormFields";

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

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiRequest("/games");
        setGames(data.games || []);
        setGamesError(false);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setGamesError(true);
      }
    };

    fetchGames();
  }, []);

  // works for every field: the input "name" matches the key in formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    setGameTouched(true);

    if (!name || !formData.game) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await apiRequest("/teams", {
        method: "POST",
        body: JSON.stringify({
          name,
          game: formData.game,
          description: formData.description.trim(),
          logo: formData.logo.trim() || null,
          banner: formData.banner.trim() || null,
        }),
      });

      router.push(`/teams/${data.team._id}`);
    } catch (err) {
      console.error("Failed to create team:", err);
      setSubmitError(err.message || "Failed to create team. Please try again.");
      setSubmitting(false);
    }
  };

  const gameMissing = gameTouched && !formData.game;

  return (
    <PageContainer maxWidth="md">
      <BackButton href="/teams">BACK TO TEAMS</BackButton>

      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          CREATE TEAM
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
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
            <TeamFormFields formData={formData} onChange={handleChange}>
              <TextField
                select
                name="game"
                label="Game"
                value={formData.game}
                onChange={handleChange}
                onBlur={() => setGameTouched(true)}
                error={gameMissing}
                helperText={gameMissing ? "Please select a game." : undefined}
                fullWidth
              >
                {games.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </TeamFormFields>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              {submitting ? "CREATING..." : "CREATE TEAM"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </PageContainer>
  );
}
