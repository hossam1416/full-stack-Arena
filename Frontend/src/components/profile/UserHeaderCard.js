"use client";

import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Shared header for a user: avatar + username on the left.
// children = extra info under the username, actions = buttons on the right.
export default function UserHeaderCard({ user, actions, children }) {
  return (
    <Card
      sx={(theme) => ({
        p: { xs: 3, md: 5 },
        backgroundImage: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.06,
        )} 0%, transparent 100%)`,
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "center", sm: "flex-start" }}
        >
          <Avatar
            src={user.avatar || undefined}
            alt={user.username || "Player"}
            sx={(theme) => ({
              width: 110,
              height: 110,
              bgcolor: "action.selected",
              color: "primary.main",
              fontSize: "2.2rem",
              fontWeight: 800,
              border: "2px solid",
              borderColor: alpha(theme.palette.primary.main, 0.35),
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
            })}
          >
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h4">{user.username}</Typography>
            {children}
          </Box>
        </Stack>

        {actions}
      </Box>
    </Card>
  );
}
