import { Box, Grid, Typography, Chip, Avatar } from "@mui/material";

export default function TeamsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: 6,
        px: 3,
        backgroundColor: "background.default",
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              textTransform: "uppercase",
              letterSpacing: "1px",
              mb: 2,
            }}
          >
            Command Your Squad
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: "480px",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
          >
            Build your team, recruit players, and take control of your squad.
            Captains can manage members, handle join requests, and prepare their
            team for competition.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 2.5,
              backgroundColor: "background.default",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2.5,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                pb: 1.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, fontSize: "1.1rem" }}
                  >
                    Red Wolves
                  </Typography>
                  <Chip
                    label="VALORANT"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(220, 38, 38, 0.15)",
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      height: 20,
                      borderRadius: 0.5,
                    }}
                  />
                </Box>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.2, fontSize: "0.8rem" }}
                >
                  5v5 Roster · 14 Wins / 2 Losses
                </Typography>
              </Box>

              <Chip
                label="CAPTAIN DASHBOARD"
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.6rem",
                  height: 22,
                }}
              />
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            >
              Active Roster (5/5)
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              {[
                { name: "Shadow", role: "Duelist", isCaptain: true },
                { name: "Viper", role: "Controller", isCaptain: false },
                { name: "Raven", role: "Initiator", isCaptain: false },
                { name: "Blaze", role: "Initiator", isCaptain: false },
                { name: "Ghost", role: "Sentinel", isCaptain: false },
              ].map((player) => (
                <Box
                  key={player.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.8,
                    px: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Avatar
                      sx={{
                        width: 26,
                        height: 26,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: player.isCaptain
                          ? "primary.main"
                          : "rgba(255, 255, 255, 0.1)",
                        color: "#fff",
                      }}
                    >
                      {player.name[0]}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {player.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {player.role}
                    </Typography>
                    {player.isCaptain && (
                      <Chip
                        label="C"
                        size="small"
                        color="primary"
                        sx={{
                          height: 16,
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          borderRadius: 0.5,
                          px: 0,
                        }}
                      />
                    )}
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
