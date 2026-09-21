"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isBlocked = !user || (adminOnly && user.role !== "admin");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else if (isBlocked) {
      router.replace("/");
    }
  }, [loading, user, isBlocked, router]);

  if (loading || isBlocked) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return children;
}
