import React, { useState } from 'react';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Assessment,
  ArrowBack,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Components
import ImageUpload from '../components/Prediction/ImageUpload';
import SymptomForm from '../components/Prediction/SymptomForm';
import ResultDisplay from '../components/Prediction/ResultDisplay';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const steps = ['Upload Image', 'Describe Symptoms', 'View Results'];

const Diagnosis = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (activeStep === 0 && !selectedImage) {
      toast.error('Please upload an eye image first');
      return;
    }
    if (activeStep === 1 && !symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }
    if (activeStep === 1) {
      submitForAnalysis();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedImage(null);
    setSymptoms('');
    setPrediction(null);
  };

  const submitForAnalysis = async () => {
    try {
      setLoading(true);
      setActiveStep(2); // Move to results step

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('symptoms', symptoms);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/prediction/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPrediction(response.data.data);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
      setActiveStep(1); // Go back to symptoms step
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialistConsult = () => {
    toast.info('Specialist consultation feature coming soon!');
  };

  const handleDownloadReport = () => {
    toast.info('Download report feature coming soon!');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ImageUpload
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage}
            loading={loading}
          />
        );
      case 1:
        return (
          <SymptomForm
            symptoms={symptoms}
            onSymptomsChange={setSymptoms}
          />
        );
      case 2:
        return (
          <ResultDisplay
            prediction={prediction}
            loading={loading}
            onSpecialistConsult={handleSpecialistConsult}
            onDownloadReport={handleDownloadReport}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🔍 Eye Disease Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload an image of your eye and describe your symptoms for AI-powered analysis
        </Typography>
      </Box>

      {/* Mobile-friendly Stepper */}
      <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
        <Stepper 
          activeStep={activeStep} 
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 3 }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={
                  index === 0 ? <CloudUpload /> :
                  index === 1 ? <Description /> :
                  <Assessment />
                }
              >
                {!isMobile || activeStep === index ? label : ''}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Progress Indicator for Mobile */}
                {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>
        )}

        {/* Step Content */}
        <Box sx={{ minHeight: isMobile ? 400 : 500 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ order: isMobile ? 2 : 1 }}
          >
            Back
          </Button>

          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            order: isMobile ? 1 : 2
          }}>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleReset}
                startIcon={<Refresh />}
                variant="outlined"
              >
                New Analysis
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                disabled={loading}
                size={isMobile ? 'large' : 'medium'}
                fullWidth={isMobile}
              >
                {activeStep === steps.length - 2 ? 'Analyze' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Mobile FAB for quick actions */}
      {isMobile && activeStep === 2 && prediction && (
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="specialist consult"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={handleSpecialistConsult}
          >
            <Assessment />
          </Fab>
        </Zoom>
      )}

      {/* User Guide Alert */}
      {activeStep === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            📱 <strong>Mobile Tips:</strong> For best results, ensure good lighting, 
            hold your device steady, and focus clearly on the affected eye area.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default Diagnosis;
