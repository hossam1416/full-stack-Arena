"use client";

import Link from "next/link";
import { Menu, MenuItem, Box, Typography, Divider } from "@mui/material";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationsMenu({
  notifications,
  anchorEl,
  open,
  onClose,
  onMarkAsRead,
}) {
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
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            backgroundColor: "background.paper",
            border: "1px solid rgba(156, 163, 175, 0.15)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
            p: 1,
          },
        },
      }}
    >
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
          Notifications
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {notifications.length === 0 ? (
        <Box sx={{ px: 2, py: 3 }}>
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", fontSize: "0.9rem" }}
          >
            No notifications yet.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            py: 1,
          }}
        >
          {notifications.slice(0, 5).map((notification) => (
            <MenuItem
              key={notification._id}
              sx={{
                p: 0,
                borderRadius: 2,
                whiteSpace: "normal",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <NotificationItem
                notification={notification}
                onRead={onMarkAsRead}
                onClose={onClose}
              />
            </MenuItem>
          ))}
        </Box>
      )}

      <Divider sx={{ borderColor: "divider" }} />

      <MenuItem
        component={Link}
        href="/notifications"
        onClick={onClose}
        sx={{
          justifyContent: "center",
          fontWeight: 700,
          color: "primary.main",
          py: 1.2,
        }}
      >
        View All Notifications
      </MenuItem>
    </Menu>
  );
}
