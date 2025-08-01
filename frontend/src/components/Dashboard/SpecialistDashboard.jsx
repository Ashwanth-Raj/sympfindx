import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Visibility,
  Comment,
  Schedule,
  Emergency,
  CheckCircle,
  Person,
  Assessment,
  Notifications,
  Message,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const SpecialistDashboard = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [reviewedCases, setReviewedCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingRes, reviewedRes, statsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/specialist/pending-cases`),
        axios.get(`${process.env.REACT_APP_API_URL}/specialist/reviewed-cases`),
        axios.get(`${process.env.REACT_APP_API_URL}/specialist/stats`)
      ]);

      setPendingCases(pendingRes.data.data);
      setReviewedCases(reviewedRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewCase = (caseData) => {
    setSelectedCase(caseData);
    setReviewDialog(true);
    setReviewNotes('');
    setDiagnosis('');
    setRecommendation('');
  };

  const submitReview = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/specialist/review-case`, {
        predictionId: selectedCase._id,
        diagnosis,
        reviewNotes,
        recommendation,
        status: 'reviewed'
      });

      toast.success('Case reviewed successfully');
      setReviewDialog(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'error';
      case 'urgent': return 'warning';
      case 'routine': return 'info';
      default: return 'default';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'emergency': return <Emergency />;
      case 'urgent': return <Schedule />;
      default: return <CheckCircle />;
    }
  };

  // Sample data for charts
  const weeklyData = [
    { day: 'Mon', cases: 12, reviewed: 10 },
    { day: 'Tue', cases: 15, reviewed: 13 },
    { day: 'Wed', cases: 8, reviewed: 8 },
    { day: 'Thu', cases: 18, reviewed: 15 },
    { day: 'Fri', cases: 22, reviewed: 20 },
    { day: 'Sat', cases: 5, reviewed: 5 },
    { day: 'Sun', cases: 3, reviewed: 3 },
  ];

  const diseaseDistribution = [
    { name: 'Conjunctivitis', value: 35, color: '#8884d8' },
    { name: 'Stye', value: 25, color: '#82ca9d' },
    { name: 'Dry Eye', value: 20, color: '#ffc658' },
    { name: 'Blepharitis', value: 15, color: '#ff7300' },
    { name: 'Others', value: 5, color: '#0088fe' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment color="primary" />
        Specialist Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {pendingCases.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    Pending Reviews
                  </Typography>
                </Box>
                <Badge badgeContent={pendingCases.filter(c => c.specialistRouting?.urgency === 'emergency').length} color="error">
                  <Notifications fontSize="large" />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {reviewedCases.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    Cases Reviewed Today
                  </Typography>
                </Box>
                <CheckCircle fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.averageResponseTime || '2.3h'}
                  </Typography>
                  <Typography variant="body2">
                    Avg Response Time
                  </Typography>
                </Box>
                <Schedule fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.accuracyRate || '94%'}
                  </Typography>
                  <Typography variant="body2">
                    Diagnosis Accuracy
                  </Typography>
                </Box>
                <Assessment fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Cases */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={pendingCases.length} color="primary">
                <Notifications />
              </Badge>
              Pending Case Reviews
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Predicted Condition</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingCases.map((case_) => (
                    <TableRow key={case_._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {case_.userId?.name || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {case_._id.slice(-6)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {case_.predictions?.combinedResult?.predictedDisease}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Confidence: {(case_.predictions?.combinedResult?.overallConfidence * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getUrgencyIcon(case_.specialistRouting?.urgency)}
                          label={case_.specialistRouting?.urgency?.toUpperCase()}
                          color={getUrgencyColor(case_.specialistRouting?.urgency)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(case_.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(case_.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Review Case">
                          <IconButton 
                            color="primary"
                            onClick={() => handleReviewCase(case_)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Analytics */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Disease Distribution
            </Typography>
            <PieChart width={300} height={250}>
              <Pie
                data={diseaseDistribution}
                cx={150}
                cy={125}
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {diseaseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Activity
            </Typography>
            <BarChart width={300} height={200} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="cases" fill="#8884d8" name="New Cases" />
              <Bar dataKey="reviewed" fill="#82ca9d" name="Reviewed" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Case Review Dialog */}
      <Dialog 
        open={reviewDialog} 
        onClose={() => setReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Review Case - {selectedCase?.userId?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCase && (
            <Grid container spacing={3}>
              {/* Case Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    AI Prediction
                  </Typography>
                  <Typography variant="h6">
                    {selectedCase.predictions?.combinedResult?.predictedDisease}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {(selectedCase.predictions?.combinedResult?.overallConfidence * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    Patient Symptoms
                  </Typography>
                  <Typography variant="body2">
                    {selectedCase.symptoms}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    Eye Image
                  </Typography>
                  <img 
                    src={selectedCase.imageUrl} 
                    alt="Patient's eye"
                    style={{ width: '100%', maxWidth: 300, borderRadius: 8 }}
                  />
                </Box>
              </Grid>

              {/* Review Form */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Final Diagnosis</InputLabel>
                    <Select
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      label="Final Diagnosis"
                    >
                      <MenuItem value="conjunctivitis">Conjunctivitis</MenuItem>
                      <MenuItem value="stye">Stye/Hordeolum</MenuItem>
                      <MenuItem value="chalazion">Chalazion</MenuItem>
                      <MenuItem value="blepharitis">Blepharitis</MenuItem>
                      <MenuItem value="dry_eye">Dry Eye Syndrome</MenuItem>
                      <MenuItem value="allergic_reaction">Allergic Reaction</MenuItem>
                      <MenuItem value="normal">Normal/No Issues</MenuItem>
                      <MenuItem value="other">Other (specify in notes)</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Clinical Notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide detailed clinical assessment and observations..."
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Treatment Recommendations"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    placeholder="Recommend treatment plan, medications, or follow-up actions..."
                  />

                  <Alert severity="info">
                    <Typography variant="body2">
                      Your review will be sent to the patient and stored for medical records.
                    </Typography>
                  </Alert>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={submitReview}
            variant="contained"
            disabled={!diagnosis || !reviewNotes}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialistDashboard;
