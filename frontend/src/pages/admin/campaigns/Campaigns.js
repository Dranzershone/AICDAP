import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Skeleton,
  Snackbar,
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
import { CampaignService } from "../../../services/campaignService";

const Campaigns = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    thisMonth: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await CampaignService.getAllCampaigns();
      if (error) {
        setError(`Error loading campaigns: ${error}`);
      } else {
        setCampaigns(data || []);
      }
    } catch (error) {
      setError("Unexpected error loading campaigns");
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await CampaignService.getCampaignStats();
      if (!error && data) {
        setStats({
          total: data.total,
          active: data.active,
          completed: data.completed,
          thisMonth: data.thisMonth,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Mock data for campaigns (fallback)
  const mockCampaigns = [
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

  // Calculate overview stats from real data
  const totalCampaigns = stats.total;
  const activeCampaigns = stats.active;
  const totalTargets = campaigns.reduce(
    (sum, c) => sum + (c.total_targets || 0),
    0,
  );
  const averageClickRate =
    campaigns.length > 0 && totalTargets > 0
      ? Math.round(
          (campaigns.reduce((sum, c) => sum + (c.total_clicked || 0), 0) /
            totalTargets) *
            100,
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

  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      const { error } = await CampaignService.deleteCampaign(
        selectedCampaign.id,
      );
      if (error) {
        setSnackbar({
          open: true,
          message: `Error deleting campaign: ${error}`,
          severity: "error",
        });
      } else {
        setCampaigns(campaigns.filter((c) => c.id !== selectedCampaign.id));
        setSnackbar({
          open: true,
          message: "Campaign deleted successfully",
          severity: "success",
        });
        loadStats(); // Refresh stats
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Unexpected error deleting campaign",
        severity: "error",
      });
    } finally {
      setShowDeleteDialog(false);
      handleMenuClose();
    }
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
                  <Typography variant="h6">
                    {loading ? <Skeleton width={40} /> : totalCampaigns}
                  </Typography>
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
                  <Typography variant="h6">
                    {loading ? <Skeleton width={40} /> : activeCampaigns}
                  </Typography>
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
                    {loading ? (
                      <Skeleton width={60} />
                    ) : (
                      totalTargets.toLocaleString()
                    )}
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
                  <Typography variant="h6">
                    {loading ? <Skeleton width={50} /> : `${averageClickRate}%`}
                  </Typography>
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
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    {error ? (
                      <Alert
                        severity="error"
                        sx={{ maxWidth: 400, mx: "auto" }}
                      >
                        {error}
                        <Button onClick={loadCampaigns} sx={{ ml: 2 }}>
                          Retry
                        </Button>
                      </Alert>
                    ) : (
                      <Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          gutterBottom
                        >
                          No campaigns found
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => navigate("/admin/campaigns/create")}
                        >
                          Create Your First Campaign
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => {
                  const progress =
                    campaign.total_targets > 0
                      ? Math.round(
                          (campaign.total_sent / campaign.total_targets) * 100,
                        )
                      : 0;

                  return (
                    <TableRow key={campaign.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            {campaign.name}
                          </Typography>
                          {campaign.template_name && (
                            <Chip
                              label={campaign.template_name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {campaign.template_name || "Custom Template"}
                        </Typography>
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
                            value={progress}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {campaign.total_targets || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            color={
                              (campaign.total_clicked || 0) > 0
                                ? "warning.main"
                                : "text.primary"
                            }
                          >
                            {campaign.total_clicked || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {campaign.total_targets > 0
                              ? Math.round(
                                  ((campaign.total_clicked || 0) /
                                    campaign.total_targets) *
                                    100,
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
                              (campaign.total_reported || 0) > 0
                                ? "success.main"
                                : "text.primary"
                            }
                          >
                            {campaign.total_reported || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {campaign.total_targets > 0
                              ? Math.round(
                                  ((campaign.total_reported || 0) /
                                    campaign.total_targets) *
                                    100,
                                )
                              : 0}
                            %
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {campaign.created_at
                            ? new Date(campaign.created_at).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, campaign)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
            onClick={handleDeleteCampaign}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Campaigns;
