import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  PlayArrow,
  Security,
  Speed,
  Timeline,
  CheckCircle,
} from "@mui/icons-material";

const Home = () => {
  const features = [
    {
      icon: <Security />,
      title: "Real-Time Monitoring",
      description:
        "Advanced bot detection algorithms that work in real-time to protect your application.",
      color: "primary",
    },
    {
      icon: <Speed />,
      title: "Reporting and Analytics",
      description:
        "Comprehensive analytics dashboard with detailed reports and insights.",
      color: "secondary",
    },
    {
      icon: <Timeline />,
      title: "Real-Time Monitoring",
      description:
        "Monitor your app's security status with real-time notifications and alerts.",
      color: "success",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Protect Your App{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Against Non-Humans
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Enter the future of bot-free mobile apps. Simplify bot
                detection, enhance user experiences, and fortify your app's
                ecosystem.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    px: 4,
                    py: 1.5,
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
                  Try Demo
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Verify you're human
                </Button>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", mt: 4, gap: 2 }}
              >
                <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Beta release 
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Key Features
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Comprehensive protection with advanced analytics and real-time
            monitoring
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  background:
                    feature.color === "primary"
                      ? "linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(41, 200, 231, 0.05) 100%)"
                      : feature.color === "secondary"
                        ? "linear-gradient(135deg, rgba(41, 200, 231, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%)"
                        : "background.paper",
                  border: `1px solid rgba(${feature.color === "primary" ? "115, 103, 240" : feature.color === "secondary" ? "41, 200, 231" : "102, 187, 106"}, 0.2)`,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${feature.color}.main`,
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {feature.description}
                  </Typography>
                  <Chip
                    label={feature.title.split(" ")[0]}
                    size="small"
                    color={feature.color}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 8 },
            background:
              "linear-gradient(135deg, rgba(30, 30, 47, 0.8) 0%, rgba(23, 23, 37, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Secure Your App?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: "auto" }}
          >
            Join thousands of developers who trust AICPAD to protect their
            applications from automated threats.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              background: "linear-gradient(135deg, #7367f0 0%, #5a4ed4 100%)",
              boxShadow: "0 4px 12px rgba(115, 103, 240, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #8b7ff5 0%, #6b5dd6 100%)",
                boxShadow: "0 6px 16px rgba(115, 103, 240, 0.4)",
              },
            }}
          >
            Get Started Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
