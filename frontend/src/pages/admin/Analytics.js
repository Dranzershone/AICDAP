import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import CampaignLineChart from "../../components/CampaignLineChart";

const Analytics = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Campaign Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed analytics of campaign performance.
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <CampaignLineChart />
      </Paper>
    </Box>
  );
};

export default Analytics;
