"use client";

import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Banner from "@/components/common/Banner";

// the chips on top of the banner: always dark, because the banner is dark
const bannerChipSx = {
  position: "absolute",
  top: 14,
  color: "#fff",
  fontWeight: 700,
  bgcolor: "rgba(15, 18, 25, 0.85)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(8px)",
  "& .MuiChip-icon": { color: "inherit" },
};

export default function TeamCard({ team }) {
  const memberCount = team.members?.length || 0;
  const captain = team.captain;

  return (
    <Card
      variant="interactive"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover .banner-image": { transform: "scale(1.06)" },
      }}
    >
      <Banner src={team.banner} height={165} overlay>
        <Chip
          label={team.game?.name || "Unknown Game"}
          size="small"
          sx={{ ...bannerChipSx, left: 14 }}
        />
        <Chip
          icon={<GroupsOutlinedIcon />}
          label={memberCount}
          size="small"
          sx={{ ...bannerChipSx, right: 14 }}
        />
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 18,
            right: 18,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {team.name}
        </Typography>
      </Banner>

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          TEAM LEADER
        </Typography>

        <Card sx={{ p: 1.5, bgcolor: "action.hover" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 800,
              }}
            >
              {captain?.username?.charAt(0).toUpperCase() || "?"}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800 }}>
                {captain?.username || "Unknown"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Team Captain
              </Typography>
            </Box>

            <WorkspacePremiumIcon color="warning" />
          </Stack>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Button
          component={Link}
          href={`/teams/${team._id}`}
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: "auto" }}
        >
          VIEW TEAM
        </Button>
      </Box>
    </Card>
  );
}
