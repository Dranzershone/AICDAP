import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About us", path: "/about" },
    { label: "User guide", path: "/guide" },
    { label: "Pricing", path: "/pricing" },
  ];

  const renderDesktopNav = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.label}
          color="inherit"
          onClick={() => navigate(item.path)}
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            fontSize: "0.95rem",
            "&:hover": {
              color: "text.primary",
              backgroundColor: "transparent",
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderMobileNav = () => (
    <>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{ color: "text.primary" }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            mt: 1.5,
          },
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              handleMenuClose();
              navigate(item.path);
            }}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "rgba(115, 103, 240, 0.1)",
              },
            }}
          >
            {item.label}
          </MenuItem>
        ))}
        <MenuItem onClick={handleMenuClose}>
          <Button
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "rgba(23, 23, 37, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: "1.5rem",
              letterSpacing: "0.5px",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            AICPAD
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              {renderDesktopNav()}
              <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate("/signup")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Sign up
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => navigate("/login")}
                  sx={{
                    background:
                      "linear-gradient(135deg, #7367f0 0%, #5a4ed4 100%)",
                    boxShadow: "0 4px 12px rgba(115, 103, 240, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #8b7ff5 0%, #6b5dd6 100%)",
                      boxShadow: "0 6px 16px rgba(115, 103, 240, 0.4)",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && renderMobileNav()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
