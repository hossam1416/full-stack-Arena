"use client";

import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";

export default function GamesSection() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiRequest("/games");

        setGames(data.games.filter((game) => game.active));
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 7, md: 10 },
        backgroundColor: "background.paper",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 900,
            letterSpacing: "0.12em",
          }}
        >
          GAMES
        </Typography>

        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Choose Your Battlefield
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            maxWidth: 600,
          }}
        >
          Compete in the games you love and prove your skills against other
          players and teams.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          {games.map((game) => (
            <Grid key={game._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Box
                sx={{
                  position: "relative",
                  height: 220,
                  overflow: "hidden",
                  borderRadius: 2,
                  border: "1px solid rgba(156, 163, 175, 0.12)",
                  backgroundColor: "background.paper",
                  transition: "all 0.25s ease",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "primary.main",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                  },

                  "&:hover .game-overlay": {
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.15))",
                  },
                }}
              >
                <Box
                  component="img"
                  src={game.banner || game.logo}
                  alt={game.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <Box
                  className="game-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    p: 2,
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.05))",
                    transition: "0.25s ease",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "1.15rem",
                      fontWeight: 900,
                    }}
                  >
                    {game.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
