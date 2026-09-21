"use client";

import Link from "next/link";
import { Menu, MenuItem, Box, Typography, Divider } from "@mui/material";

export default function UserMenu({ user, anchorEl, open, onClose, onLogout }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 200,
            backgroundColor: "background.paper",
            border: "1px solid rgba(156, 163, 175, 0.15)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          {user?.username || "Arena Player"}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
            mt: 0.25,
          }}
        >
          {user?.email || ""}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      <MenuItem
        component={Link}
        href="/profile"
        onClick={onClose}
        sx={{ fontSize: "1rem", py: 1.2 }}
      >
        Profile
      </MenuItem>

      {user?.role === "admin" && (
        <MenuItem
          component={Link}
          href="/admin"
          onClick={onClose}
          sx={{ fontSize: "1rem", py: 1.2 }}
        >
          Admin Panel
        </MenuItem>
      )}

      <MenuItem onClick={onLogout} sx={{ fontSize: "1rem", py: 1.2 }}>
        Logout
      </MenuItem>
    </Menu>
  );
}
