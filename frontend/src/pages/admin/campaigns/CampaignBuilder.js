import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  CircularProgress,
  Alert,
  Skeleton,
  TextField,
} from "@mui/material";
import {
  Groups,
  Email,
  Launch,
  ArrowForward,
  CheckCircle,
  Close,
  Send,
  Visibility,
  Edit,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { EmployeeService } from "../../../services/employeeService";
import { CampaignService } from "../../../services/campaignService";

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [showTargetDialog, setShowTargetDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
  });

  const steps = ["Select Targets", "Select Template", "Launch Campaign"];

  // Load departments and employees on component mount
  useEffect(() => {
    loadDepartmentsAndEmployees();
  }, []);

  const loadDepartmentsAndEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all employees
      const { data: employeeData, error: employeeError } =
        await EmployeeService.getAllEmployees();

      if (employeeError) {
        setError(`Error loading employees: ${employeeError}`);
        return;
      }

      setEmployees(employeeData || []);

      // Group employees by department and create department objects
      const departmentMap = {};
      (employeeData || []).forEach((employee) => {
        const dept = employee.department || "Unassigned";
        if (!departmentMap[dept]) {
          departmentMap[dept] = {
            id: dept.toLowerCase().replace(/\s+/g, "_"),
            name: dept,
            employees: [],
            employeeCount: 0,
            description: `${dept} department`,
          };
        }
        departmentMap[dept].employees.push(employee);
        departmentMap[dept].employeeCount++;
      });

      // Convert to array and sort by employee count
      const departmentList = Object.values(departmentMap).sort(
        (a, b) => b.employeeCount - a.employeeCount,
      );
      setDepartments(departmentList);
    } catch (error) {
      setError("Unexpected error loading department data");
      console.error("Error loading departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await CampaignService.getTemplates();
      if (error) {
        setError("Error loading templates");
      } else {
        setTemplates(data || []);
      }
    };
    fetchTemplates();
  }, []);

  const handleTargetSelect = (department) => {
    const isSelected = selectedTargets.find((t) => t.id === department.id);
    if (isSelected) {
      setSelectedTargets(selectedTargets.filter((t) => t.id !== department.id));
    } else {
      setSelectedTargets([...selectedTargets, department]);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedTargets.length > 0) {
      setActiveStep(1);
    } else if (activeStep === 1 && selectedTemplate) {
      setActiveStep(2);
    }
  };

  const handleLaunchCampaign = async () => {
    try {
      // 1. Create the campaign in the database first
      const campaignName =
        campaignData.name ||
        `Campaign ${new Date().toLocaleDateString()} - ${selectedTemplate?.name}`;
      const newCampaignData = {
        name: campaignName,
        description:
          campaignData.description ||
          `Phishing simulation using ${selectedTemplate?.name} template`,
        template_id: selectedTemplate?.template_id,
        template_name: selectedTemplate?.name,
        status: "draft", // Start as draft
        total_targets: selectedTargets.reduce(
          (acc, dept) => acc + dept.employeeCount,
          0,
        ),
        targets: selectedTargets,
      };

      const { data: createdCampaign, error: createError } =
        await CampaignService.createCampaign(newCampaignData);

      if (createError) {
        console.error("Error creating campaign:", createError);
        alert("Failed to create campaign. Please try again.");
        return;
      }

      // 2. Launch the campaign using the backend API
      const { error: launchError } = await CampaignService.launchCampaign({
        campaign_id: createdCampaign.id,
        name: createdCampaign.name,
        template_id: createdCampaign.template_id,
      });

      if (launchError) {
        console.error("Error launching campaign:", launchError);
        alert(`Failed to launch campaign: ${launchError}`);
        return;
      }

      setCampaignLaunched(true);
      setShowLaunchDialog(false);

      setTimeout(() => {
        navigate("/admin/campaigns");
      }, 3000);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
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

  if (campaignLaunched) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Campaign Launched Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Emails are being sent to{" "}
          {selectedTargets.reduce((acc, dept) => acc + dept.employeeCount, 0)}{" "}
          employees across {selectedTargets.length} departments using the "
          {selectedTemplate?.name}" template.
        </Typography>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Redirecting to campaigns dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Campaign
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set up a new phishing simulation campaign in three simple steps
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Main Campaign Builder UI */}
      <Paper
        sx={{
          p: 4,
          background:
            "linear-gradient(135deg, rgba(255, 77, 87, 0.1) 0%, rgba(23, 23, 37, 0.9) 100%)",
          border: "2px solid rgba(255, 77, 87, 0.3)",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "error.main",
            textAlign: "center",
            mb: 4,
            fontWeight: 600,
          }}
        >
          Create a Campaign (Detail View)
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Step 1: Select Targets */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: 200,
                cursor: loading ? "not-allowed" : "pointer",
                border:
                  selectedTargets.length > 0
                    ? "2px solid"
                    : "2px solid rgba(255, 77, 87, 0.3)",
                borderColor:
                  selectedTargets.length > 0
                    ? "success.main"
                    : "rgba(255, 77, 87, 0.3)",
                backgroundColor: "rgba(30, 30, 47, 0.8)",
                "&:hover": {
                  borderColor: "error.main",
                  backgroundColor: "rgba(30, 30, 47, 0.9)",
                },
              }}
              onClick={() => !loading && setShowTargetDialog(true)}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Groups sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "error.main", mb: 1 }}>
                  Select Targets
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {loading
                    ? "Loading departments..."
                    : "Select departments to target"}
                </Typography>
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "error.main" }} />
                ) : selectedTargets.length > 0 ? (
                  <Chip
                    label={`${selectedTargets.length} departments selected`}
                    color="success"
                    size="small"
                  />
                ) : departments.length > 0 ? (
                  <Chip
                    label={`${departments.length} departments available`}
                    color="primary"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="No departments found"
                    color="default"
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Arrow */}
          <Grid
            item
            xs={12}
            md={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowForward sx={{ color: "error.main", fontSize: 32 }} />
          </Grid>

          {/* Step 2: Select Template */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: 200,
                cursor: activeStep >= 1 ? "pointer" : "not-allowed",
                border: selectedTemplate
                  ? "2px solid"
                  : "2px solid rgba(255, 77, 87, 0.3)",
                borderColor: selectedTemplate
                  ? "success.main"
                  : "rgba(255, 77, 87, 0.3)",
                backgroundColor:
                  activeStep >= 1
                    ? "rgba(30, 30, 47, 0.8)"
                    : "rgba(30, 30, 47, 0.4)",
                opacity: activeStep >= 1 ? 1 : 0.6,
                "&:hover": {
                  borderColor:
                    activeStep >= 1 ? "error.main" : "rgba(255, 77, 87, 0.3)",
                  backgroundColor:
                    activeStep >= 1
                      ? "rgba(30, 30, 47, 0.9)"
                      : "rgba(30, 30, 47, 0.4)",
                },
              }}
              onClick={() => activeStep >= 1 && setShowTemplateDialog(true)}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Email sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "error.main", mb: 1 }}>
                  Select Template
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Google login, GitHub login, Microsoft login
                </Typography>
                {selectedTemplate && (
                  <Chip
                    label={selectedTemplate.name}
                    color="success"
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Arrow */}
          <Grid
            item
            xs={12}
            md={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowForward sx={{ color: "error.main", fontSize: 32 }} />
          </Grid>

          {/* Step 3: Launch Now */}
          <Grid item xs={12} md={2}>
            <Card
              sx={{
                height: 200,
                cursor: activeStep >= 2 ? "pointer" : "not-allowed",
                border: "2px solid rgba(255, 77, 87, 0.3)",
                backgroundColor:
                  activeStep >= 2
                    ? "rgba(30, 30, 47, 0.8)"
                    : "rgba(30, 30, 47, 0.4)",
                opacity: activeStep >= 2 ? 1 : 0.6,
                "&:hover": {
                  borderColor:
                    activeStep >= 2 ? "error.main" : "rgba(255, 77, 87, 0.3)",
                  backgroundColor:
                    activeStep >= 2
                      ? "rgba(30, 30, 47, 0.9)"
                      : "rgba(30, 30, 47, 0.4)",
                },
              }}
              onClick={() => activeStep >= 2 && setShowLaunchDialog(true)}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Launch sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "error.main" }}>
                  Launch Now
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Final Arrow */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mr: 8 }}>
          <Box sx={{ textAlign: "right" }}>
            <ArrowForward sx={{ color: "error.main", fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ color: "error.main" }}>
              Send mail to the employees selected and update the stats
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Target Selection Dialog */}
      <Dialog
        open={showTargetDialog}
        onClose={() => setShowTargetDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Target Departments
          <IconButton
            onClick={() => setShowTargetDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
              <Button onClick={loadDepartmentsAndEmployees} sx={{ ml: 2 }}>
                Retry
              </Button>
            </Alert>
          ) : departments.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              No departments found. Please add some employees first.
            </Alert>
          ) : (
            <List>
              {departments.map((dept) => (
                <ListItem key={dept.id} disablePadding>
                  <ListItemButton
                    selected={selectedTargets.find((t) => t.id === dept.id)}
                    onClick={() => handleTargetSelect(dept)}
                  >
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <Groups />
                    </Avatar>
                    <ListItemText
                      primary={dept.name}
                      secondary={`${dept.employeeCount} employees - ${dept.description}`}
                    />
                    {selectedTargets.find((t) => t.id === dept.id) && (
                      <CheckCircle sx={{ color: "success.main" }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTargetDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowTargetDialog(false);
              if (selectedTargets.length > 0) {
                handleNext();
              }
            }}
            disabled={selectedTargets.length === 0}
          >
            Continue ({selectedTargets.length} selected)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog
        open={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Select Email Template
          <IconButton
            onClick={() => setShowTemplateDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedTemplate?.id === template.id
                        ? "2px solid"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    borderColor:
                      selectedTemplate?.id === template.id
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">{template.name}</Typography>
                      <Chip
                        label={template.difficulty}
                        color={getDifficultyColor(template.difficulty)}
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {template.description}
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "background.default",
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Preview:
                      </Typography>
                      <Typography variant="body2">
                        {template.preview}
                      </Typography>
                    </Paper>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" startIcon={<Visibility />}>
                        Preview
                      </Button>
                      <Button size="small" startIcon={<Edit />}>
                        Customize
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowTemplateDialog(false);
              if (selectedTemplate) {
                handleNext();
              }
            }}
            disabled={!selectedTemplate}
          >
            Continue with {selectedTemplate?.name || "Template"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Launch Confirmation Dialog */}
      <Dialog
        open={showLaunchDialog}
        onClose={() => setShowLaunchDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Launch Campaign</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Provide campaign details and launch your phishing simulation.
          </Typography>

          <TextField
            fullWidth
            label="Campaign Name"
            value={campaignData.name}
            onChange={(e) =>
              setCampaignData({ ...campaignData, name: e.target.value })
            }
            placeholder={`Campaign ${new Date().toLocaleDateString()} - ${selectedTemplate?.name}`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Campaign Description"
            value={campaignData.description}
            onChange={(e) =>
              setCampaignData({ ...campaignData, description: e.target.value })
            }
            placeholder={`Phishing simulation using ${selectedTemplate?.name} template targeting ${selectedTargets.length} departments`}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Campaign Summary:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Targets: {selectedTargets.map((t) => t.name).join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Total Recipients:{" "}
              {selectedTargets.reduce(
                (acc, dept) => acc + dept.employeeCount,
                0,
              )}{" "}
              employees
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Template: {selectedTemplate?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Difficulty: {selectedTemplate?.difficulty}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLaunchDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Send />}
            onClick={handleLaunchCampaign}
          >
            Launch Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CampaignBuilder;
