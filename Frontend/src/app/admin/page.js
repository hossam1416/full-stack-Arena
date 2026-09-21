"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ games: 0, teams: 0, tournaments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const loadDashboard = async () => {
      try {
        setError("");

        const [gamesData, teamsData, tournamentsData] = await Promise.all([
          apiRequest("/games"),
          apiRequest("/teams"),
          apiRequest("/tournaments"),
        ]);

        setStats({
          games: gamesData.games?.length || 0,
          teams: teamsData.teams?.length || 0,
          tournaments: tournamentsData.tournaments?.length || 0,
        });
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [authLoading]);

  const statCards = [
    { label: "Games", value: stats.games },
    { label: "Teams", value: stats.teams },
    { label: "Tournaments", value: stats.tournaments },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">
          Manage and monitor Arena from one place.
        </Typography>
      </Box>

      {/* stats */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">{card.label}</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
