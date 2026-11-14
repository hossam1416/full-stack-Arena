"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import UserHeaderCard from "@/components/profile/UserHeaderCard";
import FavoriteGames from "@/components/profile/FavoriteGames";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

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
    <PageContainer maxWidth="lg">
      {/* header */}
      <Box sx={{ mb: 4 }}>
        <UserHeaderCard
          user={user}
          actions={
            mode === "view" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button variant="contained" onClick={() => setMode("edit")}>
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "text.primary" }}
                  onClick={() => setMode("password")}
                >
                  Change Password
                </Button>
              </Box>
            )
          }
        >
          <Typography variant="body2" color="text.secondary" sx={{ my: 0.5 }}>
            {user.email}
          </Typography>
          <Chip
            label={user.role}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        </UserHeaderCard>
      </Box>

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
            <Card sx={{ p: 4, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                About Me
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, whiteSpace: "pre-line" }}
              >
                {user.bio ||
                  "No bio added yet. Click 'Edit Profile' to add your gaming bio!"}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <FavoriteGames
              games={favoriteGames}
              emptyText="No favorite games selected yet."
              sx={{ height: "100%" }}
            />
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </PageContainer>
  );
}
