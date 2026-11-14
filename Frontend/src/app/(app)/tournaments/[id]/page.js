"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import {
  formatStatus,
  getPrizePool,
  getRegistrationState,
  STATUS_COLORS,
} from "@/lib/tournamentHelpers";
import { formatDate } from "@/lib/formatDate";
import PageContainer from "@/components/layout/PageContainer";
import Banner from "@/components/common/Banner";
import InfoItem from "@/components/common/InfoItem";
import ActionRow from "@/components/common/ActionRow";
import { LoadingState, MessageState } from "@/components/common/PageState";

// title and a short text on the left, a button on the right
function ActionCard({ title, text, button }) {
  return (
    <ActionRow sx={{ p: { xs: 3, md: 4 } }} actions={button}>
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">{text}</Typography>
      </Box>
    </ActionRow>
  );
}

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadTournament = async () => {
      try {
        const data = await apiRequest(`/tournaments/${id}`);
        setTournament(data.tournament);
      } catch (err) {
        setError(err.message || "Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  if (loading) {
    return (
      <PageContainer maxWidth="lg">
        <LoadingState />
      </PageContainer>
    );
  }

  if (error || !tournament) {
    return (
      <PageContainer maxWidth="lg">
        <MessageState error text={error || "Tournament not found"} />
      </PageContainer>
    );
  }

  const registration = getRegistrationState(tournament);

  // the bracket exists only after the tournament started
  const hasBracket = ["in_progress", "completed"].includes(tournament.status);

  const statCards = [
    {
      label: "Teams",
      value: `${tournament.registrationCount} / ${tournament.maxTeams}`,
    },
    {
      label: "Prize Pool",
      value: `$${getPrizePool(tournament).toLocaleString()}`,
    },
    { label: "Starts", value: formatDate(tournament.startDate) },
    {
      label: "Registration Closes",
      value: formatDate(tournament.registrationDeadline),
    },
  ];

  const infoItems = [
    { label: "Game", value: tournament.game?.name },
    { label: "Format", value: tournament.format },
    { label: "Created By", value: tournament.createdBy?.username },
  ];

  return (
    <PageContainer maxWidth="lg">
      <Stack spacing={3}>
        {/* hero: banner, status, name, description */}
        <Card>
          <Banner src={tournament.banner} height={{ xs: 140, md: 220 }} />

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Chip
                label={formatStatus(tournament.status)}
                color={STATUS_COLORS[tournament.status] || "default"}
                size="small"
              />
              <Typography color="text.secondary">
                {tournament.game?.name} • {tournament.format}
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
            >
              {tournament.name}
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 800 }}>
              {tournament.description || "No description available."}
            </Typography>
          </Box>
        </Card>

        {/* numbers */}
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {card.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* register */}
        <ActionCard
          title="Join the Tournament"
          text="Register your team and compete in this tournament."
          button={
            <Button
              component={Link}
              href={`/tournaments/${tournament._id}/register`}
              variant="contained"
              size="large"
              disabled={!registration.open}
              sx={{ minWidth: 180 }}
            >
              {registration.label}
            </Button>
          }
        />

        {/* matches */}
        {hasBracket && (
          <ActionCard
            title="Matches & Bracket"
            text="View tournament matches, results, and the competition bracket."
            button={
              <Button
                component={Link}
                href={`/tournaments/${tournament._id}/matches`}
                variant="outlined"
                size="large"
                sx={{ minWidth: 180 }}
              >
                View Matches
              </Button>
            }
          />
        )}

        {/* rules + info */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Tournament Rules
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {tournament.rules || "No specific rules have been provided."}
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Tournament Info
              </Typography>
              <Stack spacing={2}>
                {infoItems.map((item) => (
                  <InfoItem
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* registered teams */}
        <Card sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5">Registered Teams</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            {tournament.registrationCount} of {tournament.maxTeams} teams
            registered
          </Typography>

          {!tournament.registrations?.length ? (
            <Typography color="text.secondary">
              No teams have registered for this tournament yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {tournament.registrations.map((entry) => (
                <Grid key={entry._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      src={entry.team?.logo || undefined}
                      alt={entry.team?.name}
                      sx={{ width: 52, height: 52 }}
                    >
                      {entry.team?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography noWrap sx={{ fontWeight: 800 }}>
                      {entry.team?.name || "Unknown Team"}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>
      </Stack>
    </PageContainer>
  );
}
