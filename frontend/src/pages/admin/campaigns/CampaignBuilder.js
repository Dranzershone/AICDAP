import React, { useState } from "react";
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

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [showTargetDialog, setShowTargetDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);

  const steps = ["Select Targets", "Select Template", "Launch Campaign"];

  // Mock data for targets/departments
  const departments = [
    {
      id: 1,
      name: "Engineering",
      employees: 45,
      description: "Software development team",
    },
    {
      id: 2,
      name: "Marketing",
      employees: 23,
      description: "Marketing and communications",
    },
    {
      id: 3,
      name: "HR",
      employees: 12,
      description: "Human resources department",
    },
    {
      id: 4,
      name: "Sales",
      employees: 34,
      description: "Sales and business development",
    },
    {
      id: 5,
      name: "Finance",
      employees: 18,
      description: "Accounting and finance",
    },
  ];

  // Mock data for email templates
  const templates = [
    {
      id: 1,
      name: "Google Login Phishing",
      type: "Social Engineering",
      difficulty: "Medium",
      description: "Fake Google login page to test credential awareness",
      preview:
        "You have new messages in your Google account. Please log in to view them.",
    },
    {
      id: 2,
      name: "GitHub Security Alert",
      type: "Security Alert",
      difficulty: "High",
      description: "Simulated security breach notification",
      preview:
        "Suspicious activity detected on your GitHub account. Immediate action required.",
    },
    {
      id: 3,
      name: "Microsoft Office Update",
      type: "Software Update",
      difficulty: "Low",
      description: "Fake software update notification",
      preview:
        "Microsoft Office requires an urgent security update. Click to download.",
    },
  ];

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

  const handleLaunchCampaign = () => {
    setCampaignLaunched(true);
    setShowLaunchDialog(false);
    // Simulate campaign launch
    setTimeout(() => {
      navigate("/admin/campaigns");
    }, 3000);
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
          {selectedTargets.reduce((acc, dept) => acc + dept.employees, 0)}{" "}
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
                cursor: "pointer",
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
              onClick={() => setShowTargetDialog(true)}
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
                  This is used to select a department / employee
                </Typography>
                {selectedTargets.length > 0 && (
                  <Chip
                    label={`${selectedTargets.length} departments selected`}
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
                    secondary={`${dept.employees} employees - ${dept.description}`}
                  />
                  {selectedTargets.find((t) => t.id === dept.id) && (
                    <CheckCircle sx={{ color: "success.main" }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
            Are you ready to launch this phishing simulation campaign?
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Campaign Summary:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Targets: {selectedTargets.map((t) => t.name).join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Total Recipients:{" "}
              {selectedTargets.reduce((acc, dept) => acc + dept.employees, 0)}{" "}
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
