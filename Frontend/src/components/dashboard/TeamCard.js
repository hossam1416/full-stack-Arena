"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

export default function TeamCard({ team }) {
  const router = useRouter();

  const members = team.members || [];

  return (
    <Card
      sx={{
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 10px 30px ${theme.palette.action.selected}`,
        },
      }}
    >
      {/* Team Banner */}
      <Box
        sx={{
          height: 125,
          position: "relative",
          backgroundImage: team.banner
            ? `url(${team.banner})`
            : "linear-gradient(135deg, #252B36, #11151D)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.85))",
          }}
        />

        {/* Game Badge */}
        <Chip
          label={team.game?.name || "Unknown Game"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(0,0,0,0.65)",
            color: "#fff",
            fontWeight: 700,
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Members Count */}
        <Chip
          icon={<GroupsOutlinedIcon />}
          label={`${members.length} Members`}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.65)",
            color: "#fff",
            "& .MuiChip-icon": {
              color: "#fff",
            },
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Team Name */}
        <Box
          sx={{
            position: "absolute",
            bottom: 14,
            left: 16,
            right: 16,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {team.name}
          </Typography>
        </Box>
      </Box>

      {/* Team Content */}
      <Box sx={{ p: 2 }}>
        {/* Roster Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 800 }}
          >
            TEAM ROSTER
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {members.length} / 5
          </Typography>
        </Stack>

        {/* Members */}
        <Stack spacing={1}>
          {members.map((member) => {
            const isCaptain = member._id === team.captain?._id;

            return (
              <Stack
                key={member._id}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: isCaptain ? "primary.main" : "action.selected",
                    color: isCaptain ? "#fff" : "text.primary",
                    fontWeight: 800,
                  }}
                >
                  {member.username?.charAt(0).toUpperCase() || "?"}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {member.username}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {isCaptain ? "Team Captain" : "Team Member"}
                  </Typography>
                </Box>

                {isCaptain && (
                  <WorkspacePremiumOutlinedIcon
                    color="warning"
                    fontSize="small"
                  />
                )}
              </Stack>
            );
          })}
        </Stack>

        {/* View Team */}
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push(`/teams/${team._id}`)}
          sx={{ mt: 2, py: 1, borderRadius: 2 }}
        >
          VIEW TEAM
        </Button>
      </Box>
    </Card>
  );
}
