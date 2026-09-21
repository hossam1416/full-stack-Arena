"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "../../../lib/api";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
// components
import SectionTitle from "../../../components/dashboard/SectionTitle";
import AnnouncementCard from "../../../components/dashboard/AnnouncementCard";
import UpcomingMatchCard from "../../../components/dashboard/UpcomingMatchCard";
import TournamentCard from "../../../components/dashboard/TournamentCard";
import TeamCard from "../../../components/dashboard/TeamCard";
import Link from "next/link";
export default function DashboardPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [announcementsData, matchesData, tournamentsData, teamsData] =
          await Promise.all([
            apiRequest("/announcements"),
            apiRequest("/matches/upcoming"),
            apiRequest("/tournaments"),
            apiRequest("/teams/my-teams"),
          ]);

        setAnnouncements(announcementsData.announcements);
        setUpcomingMatches(matchesData.matches);
        setTournaments(tournamentsData.tournaments);
        setMyTeams(teamsData.teams);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "background.default",
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Welcome back, {user?.username}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.75,
              fontWeight: 500,
            }}
          >
            Stay ready. Your next match is waiting.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              {/* Announcements */}
              <Box>
                <SectionTitle title="ANNOUNCEMENTS" />

                <Grid container spacing={2}>
                  {announcements.slice(0, 3).map((announcement) => (
                    <Grid
                      key={announcement._id}
                      size={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <AnnouncementCard announcement={announcement} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Upcoming Matches */}
              <Box>
                <SectionTitle title="UPCOMING MATCHES" />

                <Stack spacing={1.5}>
                  {upcomingMatches.map((match) => (
                    <UpcomingMatchCard key={match._id} match={match} />
                  ))}
                </Stack>
              </Box>

              {/* Open Tournaments */}
              <Box>
                <SectionTitle title="OPEN TOURNAMENTS" />

                <Grid container spacing={2}>
                  {tournaments
                    .filter((tournament) => tournament.status === "open")
                    .map((tournament) => (
                      <Grid
                        key={tournament._id}
                        size={{ xs: 12, sm: 6, lg: 4 }}
                      >
                        <TournamentCard tournament={tournament} />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              {/* My Teams */}
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: "background.paper",
                  border: "1px solid rgba(156, 163, 175, 0.12)",
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2.5 }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 900,
                    }}
                  >
                    MY TEAMS
                  </Typography>

                  <GroupsIcon
                    sx={{
                      color: "primary.main",
                    }}
                  />
                </Stack>

                {myTeams.length > 0 ? (
                  <Stack spacing={2}>
                    {myTeams.map((team) => (
                      <TeamCard key={team._id} team={team} />
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    <GroupsIcon
                      sx={{
                        fontSize: 42,
                        color: "text.secondary",
                        mb: 1,
                      }}
                    />

                    <Typography sx={{ fontWeight: 800 }}>
                      No Teams Yet
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: "0.8rem",
                        mt: 0.5,
                      }}
                    >
                      Create or join a team to compete.
                    </Typography>

                    <Button
                      component={Link}
                      href="/teams"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        fontWeight: 800,
                      }}
                    >
                      FIND A TEAM
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
