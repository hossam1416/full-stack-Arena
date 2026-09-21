"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Notifications
          </Typography>
          <Typography color="text.secondary">
            Stay updated with your Arena activity.
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            sx={{ flexShrink: 0 }}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {loading && <CircularProgress color="primary" />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Typography color="text.secondary">No notifications yet.</Typography>
      )}

      {/* list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onRead={markAsRead}
          />
        ))}
      </Box>
    </Box>
  );
}
