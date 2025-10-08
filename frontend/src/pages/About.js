import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  Security,
  Group,
  TrendingUp,
} from '@mui/icons-material';

const About = () => {
  const stats = [
    { label: 'Apps Protected', value: '10,000+', color: 'primary' },
    { label: 'Threats Blocked', value: '50M+', color: 'secondary' },
    { label: 'Countries', value: '150+', color: 'success' },
    { label: 'Uptime', value: '99.9%', color: 'info' },
  ];

  const team = [
    {
      name: 'Advanced AI Detection',
      role: 'Machine learning algorithms trained on millions of bot patterns',
      icon: <Security />,
      color: 'primary',
    },
    {
      name: 'Global Security Network',
      role: 'Worldwide threat intelligence and real-time updates',
      icon: <Group />,
      color: 'secondary',
    },
    
    {
      name: 'Scalable Solutions',
      role: 'From startups to enterprises, we scale with your needs',
      icon: <TrendingUp />,
      color: 'info',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About <Box component="span" sx={{ color: 'primary.main' }}>AICPAD</Box>
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          We're on a mission to make the internet safer by protecting applications
          from automated threats and ensuring genuine human interactions.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          mb: 8,
          background: 'linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(41, 200, 231, 0.05) 100%)',
          border: '1px solid rgba(115, 103, 240, 0.2)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              In today's digital landscape, automated bots pose a significant threat to
              applications and user experiences. AICPAD was created to provide developers
              with powerful, easy-to-implement solutions that detect and prevent bot
              activities while maintaining seamless user experiences.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We believe that every application deserves protection from automated
              threats, regardless of size or complexity. Our technology adapts to
              emerging threats while remaining invisible to legitimate users.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'rgba(30, 30, 47, 0.5)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h3" color="primary.main" gutterBottom>
                2019
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Founded with a vision to democratize bot protection
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Our Impact
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'background.paper',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h3" color={`${stat.color}.main`} gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          What Makes Us Different
        </Typography>
        <Grid container spacing={4}>
          {team.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'background.paper',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${item.color}.main`,
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Values Section */}
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          background: 'linear-gradient(135deg, rgba(30, 30, 47, 0.8) 0%, rgba(23, 23, 37, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="Security First"
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Every decision we make prioritizes the security and safety of your applications and users.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="User Experience"
                color="secondary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Protection that's invisible to legitimate users but impenetrable to bots.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="Innovation"
                color="success"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Continuously evolving our technology to stay ahead of emerging threats.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
