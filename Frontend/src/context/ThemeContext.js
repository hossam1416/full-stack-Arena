"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import createAppTheme from "../theme/theme";

const ThemeContext = createContext(null);

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const [initialized, setInitialized] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");

    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }

    setInitialized(true);
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem("themeMode", mode);
  }, [mode, initialized]);

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
      setMode,
    }),
    [mode],
  );

  if (!initialized) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div data-theme={mode}>{children}</div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeContextProvider");
  }

  return context;
}
