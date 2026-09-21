"use client";

import Link from "next/link";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

export default function MobileNavDrawer({
  user,
  open,
  onClose,
  navItems,
  isActive,
  onLogout,
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 280,
            backgroundColor: "background.default",
            borderLeft: "1px solid rgba(156, 163, 175, 0.12)",
          },
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "text.primary",
            mb: 2,
          }}
        >
          ARENA
        </Typography>

        <List disablePadding>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={active}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: "text.secondary",
                  py: 1.2,
                  transition: "color 0.25s ease, background-color 0.25s ease",

                  "&.Mui-selected": {
                    color: "text.primary",
                    backgroundColor: "rgba(220, 38, 38, 0.12)",
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(220, 38, 38, 0.16)",
                  },
                }}
              >
                {Icon && (
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <Icon
                      sx={{
                        fontSize: "1.3rem",
                        color: active ? "primary.main" : "inherit",
                        transition: "color 0.25s ease",
                      }}
                    />
                  </ListItemIcon>
                )}

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}

          <Divider sx={{ my: 2, borderColor: "divider" }} />

          {user?.role === "admin" && (
            <ListItemButton
              component={Link}
              href="/admin"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                color: "text.secondary",
                py: 1.2,
              }}
            >
              <ListItemText
                primary="Admin Panel"
                primaryTypographyProps={{
                  sx: {
                    fontSize: "1.05rem",
                    fontWeight: 600,
                  },
                }}
              />
            </ListItemButton>
          )}

          <ListItemButton
            component={Link}
            href="/profile"
            onClick={onClose}
            sx={{
              borderRadius: 2,
              color: "text.secondary",
              py: 1.2,
            }}
          >
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                sx: {
                  fontSize: "1.05rem",
                  fontWeight: 600,
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              onClose();
              onLogout();
            }}
            sx={{
              borderRadius: 2,
              color: "error.main",
              py: 1.2,
            }}
          >
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                sx: {
                  fontSize: "1.05rem",
                  fontWeight: 600,
                },
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
