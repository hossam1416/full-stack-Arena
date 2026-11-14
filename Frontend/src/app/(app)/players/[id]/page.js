"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { apiRequest } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import UserHeaderCard from "@/components/profile/UserHeaderCard";
import FavoriteGames from "@/components/profile/FavoriteGames";

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
      } catch (err) {
        setError(err.message || "Failed to load player profile");
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
      <PageContainer maxWidth="lg">
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      </PageContainer>
    );
  }

  if (error || !player) {
    return (
      <PageContainer maxWidth="lg">
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            animation: `${fadeInUp} 0.5s ease-out`,
          }}
        >
          <Typography variant="h6">{error || "Player not found"}</Typography>
        </Card>
      </PageContainer>
    );
  }

  const memberSince = player.createdAt
    ? new Date(player.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ animation: `${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1)` }}>
        <UserHeaderCard user={player}>
          {player.bio && (
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 600 }}>
              {player.bio}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Member since {memberSince}
          </Typography>
        </UserHeaderCard>

        <FavoriteGames games={player.favoriteGames} sx={{ mt: 3 }} />
      </Box>
    </PageContainer>
  );
}
