import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  SecurityOutlined,
  DangerousOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExpandMoreOutlined,
  ContentCopyOutlined,
  DeleteOutlined,
  InfoOutlined,
  LinkOutlined,
  ShieldOutlined,
  BugReportOutlined,
} from '@mui/icons-material';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('single');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low-medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (riskLevel, isPhishing) => {
    if (isPhishing) {
      return <DangerousOutlined color="error" />;
    }
    switch (riskLevel) {
      case 'high':
        return <BugReportOutlined color="error" />;
      case 'medium':
        return <WarningOutlined color="warning" />;
      case 'low-medium':
        return <InfoOutlined color="info" />;
      case 'low':
        return <CheckCircleOutlined color="success" />;
      default:
        return <SecurityOutlined />;
    }
  };

  const validateUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const analyzeUrl = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze URL');
      }

      const data = await response.json();
      setResult(data);

      // Add to history
      setScanHistory(prev => [
        { ...data, id: Date.now() },
        ...prev.slice(0, 9) // Keep only last 10 results
      ]);

    } catch (err) {
      setError(err.message || 'Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url, API_BASE_URL]);

  const analyzeBulkUrls = useCallback(async () => {
    const urls = bulkUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) {
      setError('Please enter at least one URL to analyze');
      return;
    }

    if (urls.length > 50) {
      setError('Maximum 50 URLs allowed for bulk analysis');
      return;
    }

    const invalidUrls = urls.filter(u => !validateUrl(u));
    if (invalidUrls.length > 0) {
      setError(`Invalid URLs found: ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
      return;
    }

    setLoading(true);
    setError('');
    setBulkResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-urls/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze URLs');
      }

      const data = await response.json();
      setBulkResults(data);

    } catch (err) {
      setError(err.message || 'Failed to analyze URLs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [bulkUrls, API_BASE_URL]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
        <ShieldOutlined sx={{ mr: 2, verticalAlign: 'middle' }} />
        URL Security Scanner
      </Typography>

      {/* Tab Selection */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant={activeTab === 'single' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('single')}
          sx={{ mr: 2 }}
        >
          Single URL
        </Button>
        <Button
          variant={activeTab === 'bulk' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Analysis
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Single URL Analysis */}
      {activeTab === 'single' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analyze Single URL
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Enter URL to analyze"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && analyzeUrl()}
              />
              <Button
                variant="contained"
                onClick={analyzeUrl}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Scan'}
              </Button>
            </Box>

            {/* Single URL Result */}
            {result && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getRiskIcon(result.risk_level, result.is_phishing)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6">
                          {result.is_phishing ? 'Phishing Detected' : 'URL Analysis Complete'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {result.url}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => copyToClipboard(result.url)}
                        size="small"
                        sx={{ ml: 'auto' }}
                      >
                        <ContentCopyOutlined />
                      </IconButton>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {result.reason}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={`Risk: ${result.risk_level.toUpperCase()}`}
                        color={getRiskColor(result.risk_level)}
                        size="small"
                      />
                      <Chip
                        label={`Confidence: ${(result.confidence_score * 100).toFixed(1)}%`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={result.details.whitelisted ? 'Whitelisted' : 'Not Whitelisted'}
                        color={result.details.whitelisted ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Confidence Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={result.confidence_score * 100}
                      color={getRiskColor(result.risk_level)}
                      sx={{ height: 8, borderRadius: 4, mb: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {(result.confidence_score * 100).toFixed(1)}% confidence
                    </Typography>
                  </Grid>
                </Grid>

                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                    <Typography variant="subtitle2">Technical Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Domain: {result.details.domain}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Features Analyzed: {result.details.features_extracted}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Raw Prediction: {result.details.raw_prediction}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Threshold: {result.details.threshold}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk URL Analysis */}
      {activeTab === 'bulk' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk URL Analysis
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Enter URLs (one per line)"
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={analyzeBulkUrls}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Analyze All'}
            </Button>

            {/* Bulk Results Summary */}
            {bulkResults && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Analysis Summary
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                      <Typography variant="h4">{bulkResults.total_safe}</Typography>
                      <Typography variant="body2">Safe URLs</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                      <Typography variant="h4">{bulkResults.total_phishing}</Typography>
                      <Typography variant="body2">Phishing URLs</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                      <Typography variant="h4">{bulkResults.total_analyzed}</Typography>
                      <Typography variant="body2">Total Analyzed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4">
                        {bulkResults.total_analyzed > 0
                          ? Math.round((bulkResults.total_phishing / bulkResults.total_analyzed) * 100)
                          : 0}%
                      </Typography>
                      <Typography variant="body2">Risk Percentage</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Individual Results */}
                <Typography variant="h6" gutterBottom>
                  Individual Results
                </Typography>
                <List>
                  {bulkResults.results.map((urlResult, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getRiskIcon(urlResult.risk_level, urlResult.is_phishing)}
                        </ListItemIcon>
                        <ListItemText
                          primary={urlResult.url}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip
                                label={urlResult.risk_level}
                                color={getRiskColor(urlResult.risk_level)}
                                size="small"
                              />
                              <Typography variant="caption">
                                {(urlResult.confidence_score * 100).toFixed(1)}% confidence
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton
                          onClick={() => copyToClipboard(urlResult.url)}
                          size="small"
                        >
                          <ContentCopyOutlined />
                        </IconButton>
                      </ListItem>
                      {index < bulkResults.results.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Scans</Typography>
              <Button
                startIcon={<DeleteOutlined />}
                onClick={clearHistory}
                size="small"
                color="error"
              >
                Clear History
              </Button>
            </Box>
            <List>
              {scanHistory.map((scan, index) => (
                <React.Fragment key={scan.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getRiskIcon(scan.risk_level, scan.is_phishing)}
                    </ListItemIcon>
                    <ListItemText
                      primary={scan.url}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip
                            label={scan.risk_level}
                            color={getRiskColor(scan.risk_level)}
                            size="small"
                          />
                          <Typography variant="caption">
                            {new Date(scan.analyzed_at).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < scanHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default URLScanner;
