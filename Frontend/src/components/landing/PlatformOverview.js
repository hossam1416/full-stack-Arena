"use client";

import { Box, Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

const features = [
  {
    title: "Build Teams",
    description:
      "Create your squad, recruit players, and manage your team from one place.",
    icon: GroupsIcon,
  },
  {
    title: "Compete in Tournaments",
    description:
      "Join tournaments, battle through brackets, and fight your way to the final.",
    icon: EmojiEventsIcon,
  },
  {
    title: "Climb the Leaderboard",
    description:
      "Track your wins, follow your progress, and climb the competitive rankings.",
    icon: LeaderboardIcon,
  },
];

export default function PlatformOverview() {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        px: 3,
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          mb: 7,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Everything You Need to Compete
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: "650px",
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
          }}
        >
          Everything you need to build your squad, enter tournaments, and
          compete at the highest level.
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              {" "}
              <Box
                sx={{
                  height: "100%",
                  p: 4,
                  backgroundColor: "background.paper",
                  border: "1px solid rgba(156, 163, 175, 0.15)",
                  borderRadius: 3,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",

                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 30px -10px rgba(220, 38, 38, 0.3)",
                    "& .icon-box": {
                      backgroundColor: "primary.main",
                      color: "#FAFAFA",
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  <IconComponent sx={{ fontSize: 30 }} />
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
