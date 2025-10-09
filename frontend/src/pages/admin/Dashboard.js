import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the AICDAP admin panel. Manage your bot detection system
          from here.
        </Typography>
      </Box>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              minHeight: 300,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(41, 200, 231, 0.05) 100%)",
              border: "1px solid rgba(115, 103, 240, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(115, 103, 240, 0.3)",
                border: "1px solid rgba(115, 103, 240, 0.4)",
              },
            }}
            onClick={() => navigate("/admin/campaigns/create")}
          >
            <Typography variant="h5" gutterBottom>
              Last Campaign Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click to create a new campaign
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              minHeight: 300,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(41, 200, 231, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%)",
              border: "1px solid rgba(41, 200, 231, 0.2)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Import Employee Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              CSV upload component placeholder
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              minHeight: 300,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%)",
              border: "1px solid rgba(102, 187, 106, 0.2)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Analytics Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dashboard analytics component placeholder
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              minHeight: 300,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%)",
              border: "1px solid rgba(255, 167, 38, 0.2)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Latest Cybersecurity News
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with the latest phishing threats
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
