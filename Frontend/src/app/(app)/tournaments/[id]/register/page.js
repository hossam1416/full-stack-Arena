"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { apiRequest } from "@/lib/api";
import { getRegistrationState } from "@/lib/tournamentHelpers";
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
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((item) => item !== playerId));
    } else if (selectedPlayers.length < requiredPlayers) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
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
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Alert severity="error">{loadError}</Alert>
      </Box>
    );
  }

  // success message
  if (registered) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
          textAlign: "center",
        }}
      >
        <CheckCircleIcon color="primary" sx={{ fontSize: 64 }} />
        <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>
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
    );
  }

  // registration closed or full
  const registration = getRegistrationState(tournament);
  if (!registration.open) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Alert severity="info" sx={{ mb: 3 }}>
          {registration.label}: this tournament does not accept new teams.
        </Alert>
        <Button component={Link} href={`/tournaments/${id}`}>
          Back to tournament
        </Button>
      </Box>
    );
  }

  // ids of the teams that are already in the tournament
  const registeredIds = (tournament.registrations || []).map(
    (registration) => registration.team?._id,
  );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Button
        component={Link}
        href={`/tournaments/${id}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: "text.secondary" }}
      >
        BACK TO TOURNAMENT
      </Button>

      <Typography
        variant="h3"
        fontWeight={800}
        sx={{ mb: 1.5, fontSize: { xs: "1.9rem", md: "2.6rem" } }}
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
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <GroupsIcon color="primary" />
        <Typography variant="h5" fontWeight={800}>
          Select Your Team
        </Typography>
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
            sx={{ mt: 4, py: 1.6, fontWeight: 800 }}
          >
            {submitting ? "Registering..." : "Register Team"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
