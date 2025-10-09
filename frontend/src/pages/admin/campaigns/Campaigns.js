import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Email,
  Visibility,
  MoreVert,
  PlayArrow,
  Pause,
  Stop,
  Delete,
  TrendingUp,
  Security,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Mock data for campaigns
  const campaigns = [
    {
      id: 1,
      name: "Q4 Security Awareness",
      template: "Google Login Phishing",
      status: "active",
      progress: 75,
      targets: 120,
      clicked: 23,
      reported: 8,
      createdAt: "2024-01-15",
      difficulty: "Medium",
    },
    {
      id: 2,
      name: "GitHub Security Test",
      template: "GitHub Security Alert",
      status: "completed",
      progress: 100,
      targets: 85,
      clicked: 31,
      reported: 12,
      createdAt: "2024-01-10",
      difficulty: "High",
    },
    {
      id: 3,
      name: "Office Update Campaign",
      template: "Microsoft Office Update",
      status: "paused",
      progress: 45,
      targets: 200,
      clicked: 67,
      reported: 15,
      createdAt: "2024-01-08",
      difficulty: "Low",
    },
    {
      id: 4,
      name: "Engineering Department Test",
      template: "Google Login Phishing",
      status: "draft",
      progress: 0,
      targets: 45,
      clicked: 0,
      reported: 0,
      createdAt: "2024-01-20",
      difficulty: "Medium",
    },
  ];

  // Calculate overview stats
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalTargets = campaigns.reduce((sum, c) => sum + c.targets, 0);
  const averageClickRate =
    campaigns.length > 0
      ? Math.round(
          campaigns.reduce((sum, c) => sum + (c.clicked / c.targets) * 100, 0) /
            campaigns.length,
        )
      : 0;

  const handleMenuOpen = (event, campaign) => {
    setAnchorEl(event.currentTarget);
    setSelectedCampaign(campaign);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCampaign(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "paused":
        return "warning";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "error";
      default:
        return "primary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <PlayArrow />;
      case "completed":
        return <CheckCircle />;
      case "paused":
        return <Pause />;
      case "draft":
        return <Email />;
      default:
        return <Email />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Campaign Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, monitor, and analyze your phishing simulation campaigns
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/campaigns/create")}
          sx={{
            background: "linear-gradient(135deg, #7367f0 0%, #5a4ed4 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #8b7ff5 0%, #6b5dd6 100%)",
            },
          }}
        >
          Create Campaign
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <Email />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalCampaigns}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Campaigns
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <PlayArrow />
                </Avatar>
                <Box>
                  <Typography variant="h6">{activeCampaigns}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Campaigns
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {totalTargets.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Targets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">{averageClickRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Click Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Campaigns Table */}
      <Paper sx={{ backgroundColor: "background.paper" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Targets</TableCell>
                <TableCell>Clicked</TableCell>
                <TableCell>Reported</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {campaign.name}
                      </Typography>
                      <Chip
                        label={campaign.difficulty}
                        size="small"
                        color={getDifficultyColor(campaign.difficulty)}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{campaign.template}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(campaign.status)}
                      label={
                        campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)
                      }
                      color={getStatusColor(campaign.status)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={campaign.progress}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {campaign.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{campaign.targets}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        color={
                          campaign.clicked > 0 ? "warning.main" : "text.primary"
                        }
                      >
                        {campaign.clicked}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {campaign.targets > 0
                          ? Math.round(
                              (campaign.clicked / campaign.targets) * 100,
                            )
                          : 0}
                        %
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        color={
                          campaign.reported > 0
                            ? "success.main"
                            : "text.primary"
                        }
                      >
                        {campaign.reported}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {campaign.targets > 0
                          ? Math.round(
                              (campaign.reported / campaign.targets) * 100,
                            )
                          : 0}
                        %
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        navigate(`/admin/campaigns/${campaign.id}`)
                      }
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, campaign)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => navigate(`/admin/campaigns/${selectedCampaign?.id}`)}
        >
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {selectedCampaign?.status === "active" && (
          <MenuItem onClick={handleMenuClose}>
            <Pause sx={{ mr: 1 }} /> Pause Campaign
          </MenuItem>
        )}
        {selectedCampaign?.status === "paused" && (
          <MenuItem onClick={handleMenuClose}>
            <PlayArrow sx={{ mr: 1 }} /> Resume Campaign
          </MenuItem>
        )}
        {(selectedCampaign?.status === "active" ||
          selectedCampaign?.status === "paused") && (
          <MenuItem onClick={handleMenuClose}>
            <Stop sx={{ mr: 1 }} /> Stop Campaign
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setShowDeleteDialog(true);
          }}
          sx={{ color: "error.main" }}
        >
          <Delete sx={{ mr: 1 }} /> Delete Campaign
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Campaign</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the campaign "
            {selectedCampaign?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              // Handle delete
              setShowDeleteDialog(false);
              handleMenuClose();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Campaigns;
