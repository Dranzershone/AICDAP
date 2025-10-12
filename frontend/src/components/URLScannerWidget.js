import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  ShieldOutlined,
  SecurityOutlined,
  TrendingUpOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import urlAnalysisService from '../services/urlAnalysisService';

const URLScannerWidget = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await urlAnalysisService.getAnalysisStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load URL scanner stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return <CheckCircleOutlined color="success" />;
      case 'unhealthy':
        return <WarningOutlined color="error" />;
      default:
        return <SecurityOutlined color="warning" />;
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShieldOutlined sx={{ mr: 1 }} />
            <Typography variant="h6">URL Scanner</Typography>
          </Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={loadStats} size="small">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShieldOutlined sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">URL Scanner</Typography>
          </Box>
          <Chip
            icon={getStatusIcon(stats?.detector_status?.status)}
            label={stats?.detector_status?.status || 'Unknown'}
            color={getStatusColor(stats?.detector_status?.status)}
            size="small"
          />
        </Box>

        {/* Service Status */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {stats?.detector_status?.model_loaded ? '✓' : '✗'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Model Status
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {stats?.whitelist_domains || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trusted Domains
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Threshold Information */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Detection Threshold
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(stats?.current_threshold || 0.7) * 100}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {((stats?.current_threshold || 0.7) * 100).toFixed(0)}% confidence required
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Quick Actions */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={<LinkOutlined />}
              onClick={() => navigate('/url-scanner')}
              sx={{ textTransform: 'none' }}
            >
              Scan URL
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<TrendingUpOutlined />}
              onClick={() => navigate('/admin/url-scanner')}
              sx={{ textTransform: 'none' }}
            >
              View Details
            </Button>
          </Grid>
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            AI-powered phishing detection
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default URLScannerWidget;
