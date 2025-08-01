import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Download,
  Share,
  Schedule,
  LocalHospital,
  Psychology,
  Visibility,
  Assessment,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend } from 'recharts';

const ResultDisplay = ({ 
  prediction, 
  loading, 
  onSpecialistConsult, 
  onDownloadReport 
}) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            🔍 Analyzing Your Eye Image...
          </Typography>
          <LinearProgress sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Our AI is processing your image and symptoms. This may take a few moments.
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!prediction) {
    return null;
  }

  const { 
    predictions: { combinedResult, cnnResults, textResults },
    specialistRouting,
    imageUrl 
  } = prediction;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle />;
      case 'medium': return <Warning />;
      case 'high': return <Error />;
      case 'critical': return <Error />;
      default: return <Info />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  // Prepare chart data
  const chartData = cnnResults?.slice(0, 5).map(result => ({
    disease: result.disease.replace('_', ' '),
    confidence: Math.round(result.confidence * 100),
    probability: result.probability
  })) || [];

  const riskData = [
    { name: 'Confidence', value: Math.round(combinedResult?.overallConfidence * 100) },
    { name: 'Uncertainty', value: 100 - Math.round(combinedResult?.overallConfidence * 100) }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment color="primary" />
        Analysis Results
      </Typography>

      <Grid container spacing={3}>
        {/* Main Result Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    🔬 Primary Diagnosis
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                    {combinedResult?.predictedDisease?.replace('_', ' ')}
                  </Typography>
                </Box>
                <Chip 
                  icon={getRiskIcon(combinedResult?.riskLevel)}
                  label={`${combinedResult?.riskLevel?.toUpperCase()} RISK`}
                  color={getRiskColor(combinedResult?.riskLevel)}
                  variant="filled"
                />
              </Box>

              {/* Confidence Score */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    AI Confidence Score
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(combinedResult?.overallConfidence * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={combinedResult?.overallConfidence * 100}
                  color={getConfidenceColor(combinedResult?.overallConfidence)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Specialist Routing Alert */}
              {specialistRouting?.recommended && (
                <Alert 
                  severity={specialistRouting.urgency === 'emergency' ? 'error' : 
                           specialistRouting.urgency === 'urgent' ? 'warning' : 'info'}
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small"
                      onClick={onSpecialistConsult}
                      startIcon={<LocalHospital />}
                    >
                      Consult Specialist
                    </Button>
                  }
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {specialistRouting.urgency === 'emergency' ? '🚨 Immediate Medical Attention Required' :
                     specialistRouting.urgency === 'urgent' ? '⚠️ Specialist Consultation Recommended' :
                     '💡 Consider Professional Consultation'}
                  </Typography>
                  <Typography variant="body2">
                    Based on the analysis, we recommend consulting with a {specialistRouting.specialistType?.replace('-', ' ')}.
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  startIcon={<Download />}
                  onClick={onDownloadReport}
                >
                  Download Report
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Share />}
                  onClick={() => setShareDialog(true)}
                >
                  Share Results
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Schedule />}
                  onClick={onSpecialistConsult}
                >
                  Book Appointment
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Accordion expanded={detailsExpanded} onChange={(_, expanded) => setDetailsExpanded(expanded)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">📊 Detailed Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* CNN Results Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    📸 Image Analysis Results
                  </Typography>
                  <BarChart width={300} height={250} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="disease" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="confidence" fill="#8884d8" />
                  </BarChart>
                </Grid>

                {/* Confidence Distribution */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    🎯 Confidence Distribution
                  </Typography>
                  <PieChart width={300} height={250}>
                    <Pie
                      data={riskData}
                      cx={150}
                      cy={125}
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      <Cell fill="#4CAF50" />
                      <Cell fill="#FFC107" />
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </Grid>

                {/* Top Predictions List */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    🏆 Top AI Predictions
                  </Typography>
                  <List>
                    {cnnResults?.slice(0, 3).map((result, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: index === 0 ? 'primary.main' : 'grey.400' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={result.disease.replace('_', ' ').toUpperCase()}
                          secondary={`Confidence: ${result.probability}% | AI Score: ${(result.confidence * 100).toFixed(1)}%`}
                        />
                        <LinearProgress 
                          variant="determinate" 
                          value={result.confidence * 100}
                          sx={{ width: 100, ml: 2 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Image Preview */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              📷 Analyzed Image
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={imageUrl} 
                alt="Analyzed eye"
                style={{ 
                  width: '100%', 
                  maxHeight: 200, 
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              ⚡ Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Psychology />}
                size="small"
              >
                Get Second Opinion
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Visibility />}
                size="small"
              >
                View Similar Cases
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Schedule />}
                size="small"
              >
                Set Reminder
              </Button>
            </Box>
          </Paper>

          {/* Medical Disclaimer */}
          <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
            <Typography variant="caption">
              <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only 
              and should not replace professional medical advice. Please consult with a qualified 
              healthcare provider for proper diagnosis and treatment.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
        <DialogTitle>Share Analysis Results</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share your eye analysis results with healthcare providers or family members.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="outlined" fullWidth>
              📧 Email Results
            </Button>
            <Button variant="outlined" fullWidth>
              💬 Send via WhatsApp
            </Button>
            <Button variant="outlined" fullWidth>
              🔗 Copy Link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResultDisplay;
