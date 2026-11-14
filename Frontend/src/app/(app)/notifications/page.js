"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNotifications } from "@/context/NotificationsContext";
import PageContainer from "@/components/layout/PageContainer";
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
    <PageContainer maxWidth="md">
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
          <Typography variant="h4" gutterBottom>
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
    </PageContainer>
  );
}
