"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiRequest, markNotificationAsRead } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";
import MobileNavDrawer from "./MobileNavDrawer";
import NotificationsMenu from "@/components/notifications/NotificationsMenu";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Button,
  Avatar,
  IconButton,
  Badge,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CampaignIcon from "@mui/icons-material/Campaign";

const navItems = [
  { label: "Home", href: "/dashboard", icon: HomeIcon },
  { label: "Teams", href: "/teams", icon: GroupsIcon },
  { label: "Tournaments", href: "/tournaments", icon: EmojiEventsIcon },
  { label: "Leaderboard", href: "/leaderboard", icon: LeaderboardIcon },
  { label: "Announcements", href: "/announcements", icon: CampaignIcon },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const isUserMenuOpen = Boolean(userMenuAnchor);
  const isNotificationMenuOpen = Boolean(notificationAnchor);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiRequest("/notifications");
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const timer = setInterval(fetchNotifications, 60000);

    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout("/");
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getInitial = () => {
    if (!user?.username) {
      return "A";
    }

    return user.username.charAt(0).toUpperCase();
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          borderBottom: "1px solid rgba(156, 163, 175, 0.12)",
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: 80 }}>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, md: 4 },
            }}
          >
            <Box
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/arena-logo.png"
                alt="Arena"
                width={130}
                height={130}
                priority
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                display: { xs: "none", md: "flex" },
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    startIcon={
                      <Icon
                        sx={{
                          fontSize: "1.2rem",
                          color: active ? "primary.main" : "inherit",
                          transition: "color 0.25s ease",
                        }}
                      />
                    }
                    sx={{
                      color: active ? "text.primary" : "text.secondary",
                      fontWeight: active ? 700 : 500,
                      fontSize: "1.05rem",
                      px: 2,
                      position: "relative",
                      transition:
                        "color 0.25s ease, background-color 0.25s ease",

                      "&:hover": {
                        color: "text.primary",
                        backgroundColor: "rgba(220, 38, 38, 0.06)",
                      },

                      "&:hover .MuiButton-startIcon svg": {
                        color: "primary.main",
                      },

                      ...(active && {
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: "12px",
                          right: "12px",
                          bottom: 2,
                          height: "2px",
                          borderRadius: "2px",
                          backgroundColor: "primary.main",
                          boxShadow: "0 0 8px rgba(220, 38, 38, 0.6)",
                          transition: "opacity 0.25s ease",
                        },
                      }),
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              <IconButton
                onClick={(event) => setNotificationAnchor(event.currentTarget)}
                aria-label="Notifications"
                sx={{
                  ml: 1,
                  color: "text.secondary",

                  "&:hover": {
                    color: "text.primary",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",
                  },
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      minWidth: 18,
                      height: 18,
                      fontWeight: 700,
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ fontSize: "1.5rem" }} />
                </Badge>
              </IconButton>

              <IconButton
                onClick={handleUserMenuOpen}
                aria-label="User menu"
                sx={{
                  ml: 0.5,
                  p: 0.25,
                }}
              >
                <Avatar
                  src={user?.avatar || undefined}
                  alt={user?.username || "Arena Player"}
                  sx={{
                    width: 42,
                    height: 42,
                    backgroundColor: "primary.main",
                    color: "text.primary",
                    fontWeight: 800,
                    fontSize: "1rem",
                    border: "2px solid rgba(220, 38, 38, 0.25)",
                  }}
                >
                  {getInitial()}
                </Avatar>
              </IconButton>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
              }}
            >
              <IconButton
                component={Link}
                href="/notifications"
                aria-label="Notifications"
                sx={{
                  color: "text.secondary",
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ fontSize: "1.5rem" }} />
                </Badge>
              </IconButton>

              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                sx={{
                  color: "text.secondary",
                }}
              >
                <MenuIcon sx={{ fontSize: "1.75rem" }} />
              </IconButton>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <UserMenu
        user={user}
        anchorEl={userMenuAnchor}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        onLogout={handleLogout}
      />

      <NotificationsMenu
        notifications={notifications}
        anchorEl={notificationAnchor}
        open={isNotificationMenuOpen}
        onClose={() => setNotificationAnchor(null)}
        onMarkAsRead={handleMarkAsRead}
      />

      <MobileNavDrawer
        user={user}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
        onLogout={handleLogout}
      />
    </>
  );
}
