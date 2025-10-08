import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { commonTheme } from "./themes";
import { Header } from "./components";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider theme={commonTheme}>
      <CssBaseline />
      <BrowserRouter>
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
          <Header />
          <Box
            component="main"
            sx={{
              pt: 10, // Account for fixed header
              minHeight: "calc(100vh - 80px)",
            }}
          >
            <AppRoutes />
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
