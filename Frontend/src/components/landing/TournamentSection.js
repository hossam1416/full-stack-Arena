import { Box, Grid, Typography, Chip } from "@mui/material";

const rounds = [
  {
    title: "Quarterfinals",
    subTitle: "ROUND OF 8",
    matches: [
      {
        id: "QF 01 // BO3",
        team1: { tag: "RW", name: "Red Wolves", score: 2, isWinner: true },
        team2: { tag: "NH", name: "Night Hawks", score: 0, isWinner: false },
      },
      {
        id: "QF 02 // BO3",
        team1: { tag: "IL", name: "Iron Legion", score: 2, isWinner: true },
        team2: { tag: "SC", name: "Shadow Core", score: 1, isWinner: false },
      },
    ],
  },
  {
    title: "Semifinals",
    subTitle: "ROUND OF 4",
    matches: [
      {
        id: "SF 01 // UPPER",
        team1: { tag: "RW", name: "Red Wolves", score: 2, isWinner: true },
        team2: { tag: "IL", name: "Iron Legion", score: 1, isWinner: false },
      },
    ],
  },
  {
    title: "Grand Final",
    subTitle: "CHAMPIONSHIP",
    matches: [
      {
        id: "FINAL // BO5",
        team1: { tag: "RW", name: "Red Wolves", score: "-", isWinner: false },
        team2: { tag: "TBD", name: "TBD", score: "-", isWinner: false },
      },
    ],
  },
];

const TeamRow = ({ team, borderTop }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 1.2,
      py: 0.8,
      borderLeft: team.isWinner ? "3px solid" : "3px solid transparent",
      borderColor: team.isWinner ? "primary.main" : "transparent",
      backgroundColor: team.isWinner
        ? "rgba(220, 38, 38, 0.08)"
        : "transparent",
      borderTop: borderTop ? "1px solid rgba(255, 255, 255, 0.04)" : "none",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: team.isWinner ? 800 : 500,
        color: team.isWinner ? "text.primary" : "text.secondary",
      }}
    >
      [{team.tag}] {team.name}
    </Typography>
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: 800,
        color: team.isWinner ? "primary.main" : "text.secondary",
      }}
    >
      {team.score}
    </Typography>
  </Box>
);

export default function TournamentSection() {
  return (
    <Box
      component="section"
      sx={{ py: 8, px: 3, backgroundColor: "background.paper" }}
    >
      <Grid
        container
        spacing={5}
        sx={{ maxWidth: 1200, mx: "auto", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Chip
            label="AUTOMATED BRACKETS"
            size="small"
            sx={{
              backgroundColor: "rgba(220, 38, 38, 0.15)",
              color: "primary.main",
              fontWeight: 800,
              mb: 2,
              borderRadius: 0.5,
            }}
          />
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, textTransform: "uppercase", mb: 2 }}
          >
            Enter The Bracket
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Register your team, enter competitive tournaments, and fight through
            a single-elimination bracket. Win your matches and advance all the
            way to the final.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2.5,
              p: 3,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                pb: 1.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                }}
              >
                Valorant Champions Cup
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                  }}
                />
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: 800 }}
                >
                  IN PROGRESS
                </Typography>
              </Box>
            </Box>

            {/* Responsive Rounds Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                minHeight: { xs: "auto", md: 250 },
              }}
            >
              {rounds.map((round) => (
                <Box
                  key={round.title}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    gap: 2,
                  }}
                >
                  {/* Title per Round */}
                  <Box>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{
                        display: "block",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {round.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.6rem" }}
                    >
                      {round.subTitle}
                    </Typography>
                  </Box>

                  {/* Matches List */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: { xs: "flex-start", md: "space-around" },
                      flexGrow: 1,
                      gap: 2,
                    }}
                  >
                    {round.matches.map((match) => (
                      <Box
                        key={match.id}
                        sx={{
                          backgroundColor: "background.default",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          borderRadius: 1.5,
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            px: 1.2,
                            py: 0.4,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            backgroundColor: "rgba(255, 255, 255, 0.02)",
                          }}
                        >
                          {match.id}
                        </Typography>
                        <TeamRow team={match.team1} />
                        <TeamRow team={match.team2} borderTop />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
