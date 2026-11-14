"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { AuthProvider } from "../context/AuthContext";
import { ThemeContextProvider } from "../context/ThemeContext";

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeContextProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeContextProvider>
    </AppRouterCacheProvider>
  );
}
