"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Stack, Tab, Tabs } from "@mui/material";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Games", href: "/admin/games" },
  { label: "Teams", href: "/admin/teams" },
  { label: "Tournaments", href: "/admin/tournaments" },
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Back To Arena", href: "/dashboard" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const activeLink = links.find((link) =>
    link.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(link.href),
  );

  return (
    <ProtectedRoute adminOnly>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tabs
            value={activeLink ? activeLink.href : false}
            variant="scrollable"
            scrollButtons="auto"
          >
            {links.map((link) => (
              <Tab
                key={link.href}
                label={link.label}
                value={link.href}
                component={Link}
                href={link.href}
              />
            ))}
          </Tabs>
        </Stack>
      </Container>

      {children}
    </ProtectedRoute>
  );
}
