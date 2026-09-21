"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const HIDE_FOOTER_ROUTES = ["/login", "/register"];

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Tournaments", href: "/tournaments" },
      { label: "Teams", href: "/teams" },
      { label: "Matches", href: "/matches" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Announcements", href: "/announcements" },
      { label: "Rules & Policy", href: "/rules" },
      { label: "Support & FAQ", href: "/support" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/profile" },
      { label: "Create Team", href: "/teams/create" },
      { label: "Notifications", href: "/notifications" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

const socialLinks = [
  { label: "Twitter", icon: TwitterIcon, href: "#" },
  { label: "YouTube", icon: YouTubeIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
];

const linkSx = {
  color: "text.secondary",
  fontSize: "0.8rem",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "text.primary",
  },
};
export default function Footer() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ROUTES.includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        pt: 4,
        pb: 2.5,
        px: 3,
        mt: "auto",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.2,
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SportsEsportsIcon sx={{ fontSize: 20 }} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontSize: "1rem",
                }}
              >
                Arena
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: "0.8rem",
                lineHeight: 1.5,
                mb: 1.5,
                maxWidth: 280,
              }}
            >
              The ultimate competitive esports platform. Connect, compete, and
              lead your team to glory.
            </Typography>

            <Box sx={{ display: "flex", gap: 0.8 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <IconButton
                    key={social.label}
                    size="small"
                    aria-label={social.label}
                    sx={{
                      p: 0.6,
                      color: "text.secondary",
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      "&:hover": {
                        color: "primary.main",
                        borderColor: "primary.main",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </IconButton>
                );
              })}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              {footerSections.map((section) => (
                <Grid size={{ xs: 6, sm: 4 }} key={section.title}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "primary.main",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {section.title}
                  </Typography>

                  <Box
                    component="ul"
                    sx={{
                      listStyle: "none",
                      p: 0,
                      m: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                    }}
                  >
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <MuiLink
                          component={Link}
                          href={link.href}
                          underline="none"
                          sx={linkSx}
                        >
                          {link.label}
                        </MuiLink>
                      </li>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 2.5,
            borderColor: "rgba(255, 255, 255, 0.06)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} Arena. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2.5 }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <MuiLink
                key={link.label}
                component={Link}
                href={link.href}
                underline="none"
                sx={linkSx}
              >
                {link.label}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
