"use client";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <Box
      component="section"
      sx={{
        py: 10,
        px: 3,
        textAlign: "center",
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "2rem", md: "3rem" },
          textTransform: "uppercase",
          mb: 2,
        }}
      >
        Ready To Enter The Arena?
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: "600px",
          mx: "auto",
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Build your team, enter the competition, and prove you belong at the top.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        href="/register"
        sx={{
          px: 5,
          py: 1.5,
          boxShadow: "0 0 20px rgba(220, 38, 38, 0.35)",
          "&:hover": {
            boxShadow: "0 0 30px rgba(220, 38, 38, 0.55)",
          },
        }}
      >
        Create Your Team
      </Button>
    </Box>
  );
}
