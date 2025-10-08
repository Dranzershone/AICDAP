import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the AICPAD admin panel. Manage your bot detection system
          from here.
        </Typography>
      </Box>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(41, 200, 231, 0.05) 100%)",
              border: "1px solid rgba(115, 103, 240, 0.2)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Dashboard Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This dashboard component is ready for your admin panel
              implementation.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
