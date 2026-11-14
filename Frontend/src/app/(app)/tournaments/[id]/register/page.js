"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { apiRequest } from "@/lib/api";
import { getRegistrationState } from "@/lib/tournamentHelpers";
import PageContainer from "@/components/layout/PageContainer";
import BackButton from "@/components/common/BackButton";
import { LoadingState, MessageState } from "@/components/common/PageState";
import TeamPicker from "@/components/tournaments/TeamPicker";
import PlayerPicker from "@/components/tournaments/PlayerPicker";

export default function TournamentRegisterPage() {
  const { id } = useParams();

  // data from the server
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [requiredPlayers, setRequiredPlayers] = useState(0);
  // what the captain selects
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  // sending the registration
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registered, setRegistered] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [tournamentData, optionsData] = await Promise.all([
          apiRequest(`/tournaments/${id}`),
          apiRequest(`/registrations/${id}`),
        ]);

        setTournament(tournamentData.tournament);
        setTeams(optionsData.teams);
        setRequiredPlayers(optionsData.requiredPlayers);
      } catch (err) {
        setLoadError(err.message || "Failed to load registration data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // selecting a team clears the players of the old team
  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setSelectedPlayers([]);
  };

  // select or unselect a player (never more than requiredPlayers)
  const handleTogglePlayer = (playerId) => {
    setSelectedPlayers((current) => {
      if (current.includes(playerId)) {
        return current.filter((item) => item !== playerId);
      }
      if (current.length < requiredPlayers) {
        return [...current, playerId];
      }
      return current;
    });
  };

  const handleRegister = async () => {
    try {
      setSubmitting(true);
      setSubmitError("");

      await apiRequest(`/registrations/${id}`, {
        method: "POST",
        body: JSON.stringify({
          teamId: selectedTeam._id,
          players: selectedPlayers,
        }),
      });

      setRegistered(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to register team");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer maxWidth="lg">
        <LoadingState />
      </PageContainer>
    );
  }

  if (loadError) {
    return (
      <PageContainer maxWidth="lg">
        <MessageState error text={loadError} />
      </PageContainer>
    );
  }

  // success message
  if (registered) {
    return (
      <PageContainer maxWidth="lg">
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 64 }} />
          <Typography variant="h4" sx={{ mt: 2 }}>
            Registration Successful
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Your team <strong>{selectedTeam.name}</strong> is registered for{" "}
            {tournament.name}.
          </Typography>
          <Button
            component={Link}
            href={`/tournaments/${id}`}
            variant="contained"
          >
            Go to tournament
          </Button>
        </Box>
      </PageContainer>
    );
  }

  // registration closed or full
  const registration = getRegistrationState(tournament);
  if (!registration.open) {
    return (
      <PageContainer maxWidth="lg">
        <Alert severity="info" sx={{ mb: 3 }}>
          {registration.label}: this tournament does not accept new teams.
        </Alert>
        <BackButton href={`/tournaments/${id}`}>BACK TO TOURNAMENT</BackButton>
      </PageContainer>
    );
  }

  // ids of the teams that are already in the tournament
  const registeredIds = (tournament.registrations || []).map(
    (entry) => entry.team?._id,
  );

  return (
    <PageContainer maxWidth="lg">
      <BackButton href={`/tournaments/${id}`}>BACK TO TOURNAMENT</BackButton>

      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}
      >
        Register for{" "}
        <Box component="span" sx={{ color: "primary.main" }}>
          {tournament.name}
        </Box>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 6 }}>
        Select the team and players you want to use in this tournament.
      </Typography>

      {/* team */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <GroupsIcon color="primary" />
        <Typography variant="h5">Select Your Team</Typography>
      </Stack>

      {teams.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button component={Link} href="/teams/create" size="small">
              Create team
            </Button>
          }
        >
          You need to be the captain of a {tournament.game?.name} team to
          register.
        </Alert>
      ) : (
        <TeamPicker
          teams={teams}
          requiredPlayers={requiredPlayers}
          registeredIds={registeredIds}
          selectedTeam={selectedTeam}
          onSelect={handleSelectTeam}
        />
      )}

      {/* players */}
      {selectedTeam && (
        <Box sx={{ mt: 6 }}>
          <PlayerPicker
            team={selectedTeam}
            requiredPlayers={requiredPlayers}
            selectedPlayers={selectedPlayers}
            onToggle={handleTogglePlayer}
          />

          {submitError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {submitError}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={submitting || selectedPlayers.length !== requiredPlayers}
            onClick={handleRegister}
            sx={{ mt: 4 }}
          >
            {submitting ? "Registering..." : "Register Team"}
          </Button>
        </Box>
      )}
    </PageContainer>
  );
}
