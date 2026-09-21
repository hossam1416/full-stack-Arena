"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const cardSx = {
  p: 4,
  height: "100%",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 4,
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [games, setGames] = useState([]);
  const [mode, setMode] = useState("view");
  const [message, setMessage] = useState("");

  // the games list is needed to show the names of the favorite games
  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await apiRequest("/games");
        setGames(data.games || []);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    };

    loadGames();
  }, []);

  if (!user) return null;

  const favoriteGames = games.filter((game) =>
    user.favoriteGames?.includes(game._id),
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
      {/* header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          backgroundImage:
            "linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(0, 0, 0, 0) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
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
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={3}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Avatar
              src={user.avatar || undefined}
              alt={user.username}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                fontWeight: 800,
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                color: "primary.main",
                border: "2px solid rgba(220, 38, 38, 0.35)",
              }}
            >
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
              />
            </Box>
          </Stack>

          {mode === "view" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => setMode("edit")}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",
                  },
                }}
                onClick={() => setMode("password")}
              >
                Change Password
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* edit profile */}
      {mode === "edit" && (
        <EditProfileForm
          user={user}
          games={games}
          onSaved={(updatedUser) => {
            updateUser(updatedUser);
            setMode("view");
            setMessage("Profile updated");
          }}
          onCancel={() => setMode("view")}
        />
      )}

      {/* change password */}
      {mode === "password" && (
        <ChangePasswordForm
          onDone={() => {
            setMode("view");
            setMessage("Password updated");
          }}
          onCancel={() => setMode("view")}
        />
      )}

      {/* profile info */}
      {mode === "view" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={cardSx}>
              <Typography variant="h6" fontWeight={600} mb={1.5}>
                About Me
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, whiteSpace: "pre-line", lineHeight: 1.7 }}
              >
                {user.bio ||
                  "No bio added yet. Click 'Edit Profile' to add your gaming bio!"}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={cardSx}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Favorite Games
              </Typography>

              {favoriteGames.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {favoriteGames.map((game) => (
                    <Chip key={game._id} label={game.name} variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No favorite games selected yet.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
}
