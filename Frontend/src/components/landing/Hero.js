"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";

export default function Hero() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        position: "relative",
        background: (theme) =>
          `radial-gradient(
            circle at center,
            rgba(220, 38, 38, 0.15) 0%,
            ${theme.palette.background.default} 70%
          )`,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Image
          src="/images/arena-logo.png"
          alt="Arena Logo"
          width={280}
          height={280}
          priority
          style={{ objectFit: "contain" }}
        />
      </Box>

      <Typography
        variant="h1"
        color="text.primary"
        sx={{
          fontSize: {
            xs: "2.5rem",
            sm: "3.5rem",
            md: "4.5rem",
          },
          lineHeight: 1.1,
          maxWidth: "900px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Build Your Team. Dominate The Arena.
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mt: 2,
          mb: 4,
          maxWidth: "650px",
          fontSize: {
            xs: "1rem",
            sm: "1.2rem",
          },
        }}
      >
        Assemble your squad, compete in automated brackets, track your lifetime
        stats, and climb to the top of esports leaderboards.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          component={Link}
          href="/register"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: { xs: 5, sm: 6 },
            py: { xs: 1.8, sm: 2 },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
            "&:hover": {
              boxShadow: "0 0 30px rgba(220, 38, 38, 0.7)",
            },
          }}
        >
          Sign Up
        </Button>

        <Button
          component={Link}
          href="/login"
          variant="outlined"
          color="secondary"
          size="large"
          sx={{
            px: { xs: 5, sm: 6 },
            py: { xs: 1.8, sm: 2 },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            color: "text.primary",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Log In
        </Button>
      </Stack>
    </Box>
  );
}
