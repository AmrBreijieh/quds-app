import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create the MUI theme
const theme = createTheme({
  direction: "rtl", // RTL support
  palette: {
    mode: "light",
    primary: {
      main: "#d8a336",
      // light: "red", // Light version of the primary color
      // dark: "red", // Dark version of the primary color
      // contrastText: "red", // Text color on primary
    },
    secondary: {
      main: "#00000", // Pink secondary color
      light: "#00000", // Light version of the secondary color
      dark: "#00000", // Dark version of the secondary color
      contrastText: "#00000", // Text color on secondary
    },
    background: {
      default: "#f5f5f5", // Background color of the app
      paper: "#ffffff", // Paper background color (for cards, modals, etc.)
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#c66900",
    },
    error: {
      main: "#f44336", // Standard Red
      light: "#e57373",
      dark: "#850909",
      contrastText: "#fff",
    },
  },

  typography: {
    fontFamily: "var(--font-cairo)", // Use CSS variable for Cairo
  },
});

const Providers = ({ children }) => {
  // const emotionCache = createEmotionCache();

  return (
    // <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </CacheProvider>
  );
};

export default Providers;
