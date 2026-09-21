"use client";

import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function TeamCard({ team }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "rgba(220, 38, 38, 0.35)",
          boxShadow: "0 0 20px rgba(220, 38, 38, 0.08)",
          transform: "translateY(-4px)",
          "& .team-banner": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      <Box sx={{ height: 140, overflow: "hidden", position: "relative" }}>
        <Box
          className="team-banner"
          sx={{
            height: "100%",
            width: "100%",
            position: "absolute",
            inset: 0,
            transition: "transform 0.4s ease",
            backgroundImage: team.banner
              ? `url(${team.banner})`
              : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(12,10,10,0.05), rgba(12,10,10,0.85))",
          }}
        />

        {!team.banner && (
          <Typography
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.08)",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            ARENA
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 900,
          }}
        >
          {team.name}
        </Typography>

        <Typography
          color="primary.main"
          sx={{
            mt: 0.5,
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {team.game?.name || "Unknown Game"}
        </Typography>

        <Stack spacing={0.5} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ fontSize: "0.8rem" }}>
            Captain: {team.captain?.username || "Unknown"}
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: "0.8rem" }}>
            {team.members?.length || 0} Members
          </Typography>
        </Stack>

        <Button
          component={Link}
          href={`/teams/${team._id}`}
          variant="outlined"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: "auto",
            pt: 1,
            fontWeight: 800,
            borderColor: "rgba(156, 163, 175, 0.3)",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "rgba(220, 38, 38, 0.05)",
            },
          }}
        >
          VIEW TEAM
        </Button>
      </Box>
    </Box>
  );
}
