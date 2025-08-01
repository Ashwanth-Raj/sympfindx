import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  useTheme,
  useMediaQuery,
  Fab,
  Paper,
  Chip,
} from '@mui/material';
import {
  CameraAlt,
  Assessment,
  LocalHospital,
  Speed,
  Security,
  Groups,
  ArrowForward,
  PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <CameraAlt sx={{ fontSize: 40 }} />,
      title: 'Image Analysis',
      description: 'Advanced CNN-based eye disease detection from smartphone photos',
      color: theme.palette.primary.main,
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Symptom Processing',
      description: 'AI-powered text analysis of patient-described symptoms',
      color: theme.palette.secondary.main,
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      title: 'Specialist Routing',
      description: 'Intelligent routing to appropriate eye care specialists',
      color: theme.palette.success.main,
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Fast Results',
      description: 'Get AI analysis results in under 30 seconds',
      color: theme.palette.warning.main,
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'HIPAA-compliant data handling and privacy protection',
      color: theme.palette.info.main,
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Community Care',
      description: 'Connecting underserved communities with eye care',
      color: theme.palette.error.main,
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Analyses Completed' },
    { value: '94%', label: 'Accuracy Rate' },
    { value: '500+', label: 'Specialists Connected' },
    { value: '50+', label: 'Countries Served' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip
                  label="🚀 AI-Powered Healthcare"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mb: 2,
                  }}
                />
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  Early Eye Disease Detection Made Simple
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                >
                  Upload a photo of your eye, describe your symptoms, and get instant AI-powered 
                  analysis with specialist routing. Preventing blindness through accessible technology.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAlt />}
                    onClick={() => navigate(isAuthenticated ? '/diagnosis' : '/register')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Start Analysis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box
                  component="img"
                  src="/api/placeholder/400/300"
                  alt="Eye analysis illustration"
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                />
                {/* Floating elements for mobile */}
                {isMobile && (
                  <Fab
                    color="secondary"
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: 20,
                    }}
                    onClick={() => navigate('/diagnosis')}
                  >
                    <CameraAlt />
                  </Fab>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              How SympFindX Works
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Our AI-powered platform combines image analysis and symptom processing 
              to provide accurate eye disease detection and specialist routing.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: feature.color,
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who trust SympFindX for early eye disease detection. 
            Start your analysis today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(isAuthenticated ? '/diagnosis' : '/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 1.5,
                px: 4,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              {isAuthenticated ? 'Start Analysis' : 'Sign Up Free'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 1.5,
                px: 4,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
