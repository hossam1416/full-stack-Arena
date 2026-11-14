import { alpha, createTheme } from "@mui/material/styles";

const borderColor = (mode) =>
  mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(60, 50, 40, 0.14)";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    background: {
      default: mode === "dark" ? "#090B10" : "#ECEBE8",
      paper: mode === "dark" ? "#151922" : "#F7F6F3",
    },
    primary: {
      main: mode === "dark" ? "#E53935" : "#D32F2F",
      light: "#FF5252",
      dark: "#C62828",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: mode === "dark" ? "#A1A1AA" : "#57534E",
    },
    success: {
      main: "#22C55E",
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#F59E0B",
    },
    text: {
      primary: mode === "dark" ? "#F4F4F5" : "#292524",
      secondary: mode === "dark" ? "#A1A1AA" : "#57534E",
    },
    divider: borderColor(mode),
    action: {
      hover:
        mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(60, 50, 40, 0.06)",
      selected:
        mode === "dark" ? "rgba(229, 57, 53, 0.12)" : "rgba(211, 47, 47, 0.10)",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h3: { fontWeight: 900, letterSpacing: "-0.02em" },
    h4: { fontWeight: 900, letterSpacing: "-0.02em" },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // The page background now comes only from palette.background.default
    // (CssBaseline applies it to <body> automatically).
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow:
            mode === "light" ? "0 1px 3px rgba(60, 50, 40, 0.08)" : "none",
          // <Card variant="interactive"> = a card that lifts on hover
          ...(ownerState.variant === "interactive" && {
            transition:
              "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              borderColor: alpha(theme.palette.primary.main, 0.4),
              boxShadow: theme.shadows[4],
            },
          }),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "dark" ? "#11151D" : "#F7F6F3",
          color: mode === "dark" ? "#F4F4F5" : "#292524",
          boxShadow: "none",
          borderBottom: `1px solid ${borderColor(mode)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            backgroundColor: mode === "dark" ? "#FF5252" : "#B71C1C",
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          borderColor: borderColor(mode),
          "&:hover": {
            borderColor: mode === "dark" ? "#E53935" : "#D32F2F",
            backgroundColor:
              mode === "dark"
                ? "rgba(229, 57, 53, 0.08)"
                : "rgba(211, 47, 47, 0.08)",
          },
        },
      },
    },
    // Moved out of MuiButton: it must live directly under `components`
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[8],
          padding: theme.spacing(1.5, 2),
        }),
        arrow: ({ theme }) => ({
          color: theme.palette.background.paper,
          "&::before": {
            border: `1px solid ${theme.palette.divider}`,
          },
        }),
      },
    },
  },
});

const createAppTheme = (mode) => createTheme(getDesignTokens(mode));

export default createAppTheme;
