"use client";

import { useRouter } from "next/navigation";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function TeamCard({ team }) {
  const router = useRouter();

  return (
    <Box
      sx={{
        overflow: "hidden",
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 2,
        backgroundColor: "rgba(12, 10, 10, 0.35)",
      }}
    >
      {/* Team Banner */}
      <Box
        sx={{
          height: 90,
          backgroundImage: team.banner
            ? `url(${team.banner})`
            : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(12,10,10,0.05), rgba(12,10,10,0.8))",
          }}
        />

        {!team.banner && (
          <Typography
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.08)",
              fontSize: "1.5rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            ARENA
          </Typography>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 900,
              }}
            >
              {team.name}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                mt: 0.25,
              }}
            >
              {team.game?.name || "Unknown Game"}
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: "0.7rem",
            }}
          >
            {team.members?.length || 0} members
          </Typography>
        </Stack>

        <Stack spacing={1}>
          {team.members?.map((member) => (
            <Stack
              key={member._id}
              direction="row"
              alignItems="center"
              spacing={1.25}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: "rgba(220, 38, 38, 0.18)",
                  color: "text.primary",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                }}
              >
                {member.username.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {member.username}
                </Typography>

                {member._id === team.captain?._id && (
                  <Typography
                    color="primary.main"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    Captain
                  </Typography>
                )}
              </Box>
            </Stack>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push(`/teams/${team._id}`)}
          sx={{
            mt: 2,
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
