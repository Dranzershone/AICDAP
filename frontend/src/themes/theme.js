import { createTheme } from "@mui/material/styles";

const commonTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff6b35", // bright orange
      light: "#ff8a65",
      dark: "#e64a19",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00e676", // bright green
      light: "#4caf50",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa", // bright light gray
      paper: "#ffffff", // pure white for cards
    },
    text: {
      primary: "#212121",
      secondary: "rgba(33,33,33,0.7)",
      disabled: "rgba(33,33,33,0.5)",
    },
    error: {
      main: "#f44336",
      light: "#ef5350",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ffeb3b",
      light: "#fff176",
      dark: "#f57f17",
    },
    info: {
      main: "#00bcd4",
      light: "#26c6da",
      dark: "#0097a7",
    },
    success: {
      main: "#4caf50",
      light: "#66bb6a",
      dark: "#388e3c",
    },
    divider: "rgba(0,0,0,0.12)",
  },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase",
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(255, 107, 53, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #ff6b35 0%, #e64a19 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #ff8a65 0%, #ff5722 100%)",
          },
        },
        outlined: {
          borderColor: "#ff6b35",
          color: "#ff6b35",
          "&:hover": {
            borderColor: "#ff8a65",
            backgroundColor: "rgba(255, 107, 53, 0.1)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 0, 0, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff6b35",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)",
          },
          "& .MuiInputBase-input": {
            color: "#212121",
          },
        },
      },
    },
  },
});

export default commonTheme;
