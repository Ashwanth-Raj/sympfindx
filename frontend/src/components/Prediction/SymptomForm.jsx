import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Chip,
  Grid,
  Slider,
  Alert,
} from '@mui/material';

const commonSymptoms = [
  'Redness',
  'Itching',
  'Burning sensation',
  'Watery eyes',
  'Discharge',
  'Swelling',
  'Pain',
  'Blurred vision',
  'Sensitivity to light',
  'Foreign body sensation',
  'Crusting',
  'Dryness',
];

const SymptomForm = ({ symptoms, onSymptomsChange }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Handle symptom checkbox changes
  const handleSymptomChange = (symptom) => {
    const newSelected = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    
    setSelectedSymptoms(newSelected);
    updateSymptomsText(newSelected, duration, severity, additionalNotes);
  };

  // Handle text field changes
  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'duration':
        setDuration(value);
        break;
      case 'severity':
        setSeverity(value);
        break;
      case 'notes':
        setAdditionalNotes(value);
        break;
      default:
        break;
    }
    updateSymptomsText(selectedSymptoms, 
      field === 'duration' ? value : duration,
      field === 'severity' ? value : severity,
      field === 'notes' ? value : additionalNotes
    );
  };

  // Update the combined symptoms text
  const updateSymptomsText = (symptoms, dur, sev, notes) => {
    const symptomsText = symptoms.join(', ');
    const severityText = `Severity: ${sev}/10`;
    const durationText = dur ? `Duration: ${dur}` : '';
    const notesText = notes ? `Additional notes: ${notes}` : '';
    
    const combinedText = [symptomsText, severityText, durationText, notesText]
      .filter(Boolean)
      .join('. ');
    
    onSymptomsChange(combinedText);
  };

  const getSeverityLabel = (value) => {
    if (value <= 3) return 'Mild';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Severe';
    return 'Very Severe';
  };

  const getSeverityColor = (value) => {
    if (value <= 3) return 'success';
    if (value <= 6) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🔍 Describe Your Symptoms
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the symptoms you're experiencing and provide additional details to help with accurate diagnosis.
      </Typography>

      <Grid container spacing={3}>
        {/* Common Symptoms */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Common Eye Symptoms
            </FormLabel>
            <FormGroup>
              {commonSymptoms.map((symptom) => (
                <FormControlLabel
                  key={symptom}
                  control={
                    <Checkbox
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      color="primary"
                    />
                  }
                  label={symptom}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Symptom Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Severity Slider */}
            <Paper sx={{ p: 3 }}>
              <Typography gutterBottom sx={{ fontWeight: 600 }}>
                Symptom Severity
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={severity}
                  onChange={(_, value) => handleFieldChange('severity', value)}
                  aria-labelledby="severity-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                  color={getSeverityColor(severity)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">Mild (1)</Typography>
                  <Chip 
                    label={`${getSeverityLabel(severity)} (${severity}/10)`}
                    color={getSeverityColor(severity)}
                    size="small"
                  />
                  <Typography variant="caption">Severe (10)</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Duration */}
            <Paper sx={{ p: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                  How long have you had these symptoms?
                </FormLabel>
                <RadioGroup
                  value={duration}
                                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                  row
                >
                  <FormControlLabel 
                    value="less than 1 day" 
                    control={<Radio />} 
                    label="< 1 day" 
                  />
                  <FormControlLabel 
                    value="1-3 days" 
                    control={<Radio />} 
                    label="1-3 days" 
                  />
                  <FormControlLabel 
                    value="1 week" 
                    control={<Radio />} 
                    label="1 week" 
                  />
                  <FormControlLabel 
                    value="more than 1 week" 
                    control={<Radio />} 
                    label="> 1 week" 
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Box>
        </Grid>

        {/* Additional Notes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Notes"
              placeholder="Describe any other symptoms, when they started, what might have triggered them, or any other relevant information..."
              value={additionalNotes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Selected Symptoms Summary */}
        {selectedSymptoms.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Selected Symptoms Summary:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedSymptoms.map((symptom) => (
                  <Chip 
                    key={symptom}
                    label={symptom}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SymptomForm;
