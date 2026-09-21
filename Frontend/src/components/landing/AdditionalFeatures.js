import { Box, Grid, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FlagIcon from "@mui/icons-material/Flag";
import CampaignIcon from "@mui/icons-material/Campaign";

const features = [
  {
    title: "Smart Notifications",
    description:
      "Stay updated with team invitations, match schedules, results, and tournament progress.",
    icon: NotificationsIcon,
  },
  {
    title: "Match Tracking",
    description:
      "Follow your upcoming matches, results, and tournament progression from one place.",
    icon: SportsEsportsIcon,
  },
  {
    title: "Platform Announcements",
    description:
      "Keep up with tournament updates, platform news, and important community announcements.",
    icon: CampaignIcon,
  },
];

export default function AdditionalFeatures() {
  return (
    <Box
      component="section"
      sx={{
        py: 8,
        px: 3,
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          maxWidth: "750px",
          mx: "auto",
          mb: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          Built For Competition
        </Typography>

        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Everything around the competition matters. Arena keeps players
          informed, connected, and ready for their next match.
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: "1100px",
          mx: "auto",
        }}
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: "background.default",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 2.5,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(220, 38, 38, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1.5,
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    color: "primary.main",
                  }}
                >
                  <Icon sx={{ fontSize: 26 }} />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
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
