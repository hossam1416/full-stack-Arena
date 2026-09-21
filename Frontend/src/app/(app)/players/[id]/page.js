"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { keyframes } from "@emotion/react";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function PlayerProfilePage() {
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await apiRequest(`/auth/players/${id}`);
        setPlayer(data.user);
      } catch (error) {
        setError(error.message || "Failed to load player profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlayer();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !player) {
    return (
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            backgroundColor: "background.paper",
            border: "1px solid rgba(156, 163, 175, 0.12)",
            borderRadius: 3,
            textAlign: "center",
            animation: `${fadeInUp} 0.5s ease-out`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
            }}
          >
            {error || "Player not found"}
          </Typography>
        </Paper>
      </Container>
    );
  }

  const memberSince = player.createdAt
    ? new Date(player.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <Box
      sx={{
        py: 2,
        animation: `${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            backgroundColor: "background.paper",
            backgroundImage:
              "linear-gradient(135deg, rgba(220, 38, 38, 0.03) 0%, rgba(0, 0, 0, 0) 100%)",
            border: "1px solid rgba(156, 163, 175, 0.12)",
            borderRadius: 4,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "rgba(220, 38, 38, 0.25)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Avatar
              src={player.avatar || undefined}
              alt={player.username || "Player"}
              sx={{
                width: 110,
                height: 110,
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                color: "primary.main",
                fontSize: "2.2rem",
                fontWeight: 800,
                border: "2px solid rgba(220, 38, 38, 0.35)",
                boxShadow: "0 4px 20px rgba(220, 38, 38, 0.2)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {player.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box
              sx={{
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                {player.username}
              </Typography>

              {player.bio && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1.5,
                    maxWidth: 600,
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {player.bio}
                </Typography>
              )}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 2,
                  fontSize: "0.85rem",
                  opacity: 0.8,
                }}
              >
                Member since {memberSince}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {player.favoriteGames?.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: { xs: 3, md: 4 },
              backgroundColor: "background.paper",
              border: "1px solid rgba(156, 163, 175, 0.12)",
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 2.5,
                fontSize: "1.1rem",
              }}
            >
              Favorite Games
            </Typography>

            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              {player.favoriteGames.map((game) => (
                <Paper
                  key={game._id}
                  elevation={0}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    backgroundColor: "rgba(156, 163, 175, 0.04)",
                    border: "1px solid rgba(156, 163, 175, 0.1)",
                    borderRadius: 2.5,
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(220, 38, 38, 0.06)",
                      borderColor: "rgba(220, 38, 38, 0.3)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {game.logo && (
                    <Avatar
                      src={game.logo}
                      alt={game.name}
                      sx={{
                        width: 36,
                        height: 36,
                      }}
                    />
                  )}

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {game.name}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
