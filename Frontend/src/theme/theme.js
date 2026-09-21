import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0C0A0A",
      paper: "#1A1616",
    },

    primary: {
      main: "#DC2626",
    },

    secondary: {
      main: "#9CA3AF",
    },

    success: {
      main: "#22C55E",
    },

    error: {
      main: "#F97316",
      light: "#FB923C",
    },

    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
    },

    text: {
      primary: "#FAFAFA",
      secondary: "#A1A1AA",
    },

    divider: "#9CA3AF",
  },

  typography: {
    fontFamily: "Arial, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;
