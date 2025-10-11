import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { commonTheme } from "./themes";
import { Header } from "./components";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(
    location.pathname,
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        background: `
          radial-gradient(ellipse at top, rgba(115, 103, 240, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(41, 200, 231, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #171725 0%, #1a1a2e 50%, #16213e 100%)
        `,
      }}
    >
      {!isAuthPage && <Header />}
      <Box
        component="main"
        sx={{
          pt: !isAuthPage ? 10 : 0, // Account for fixed header only if not auth page
          minHeight: !isAuthPage ? "calc(100vh - 80px)" : "100vh",
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={commonTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
