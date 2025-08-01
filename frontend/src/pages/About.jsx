import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        About SympFindX
      </Typography>
      <Typography variant="body1" paragraph>
        SympFindX is an AI-powered eye disease detection platform that combines 
        image analysis and symptom processing to provide early detection and 
        specialist routing for eye conditions.
      </Typography>
      <Typography variant="body1" paragraph>
        Our mission is to make eye care accessible to underserved communities 
        through innovative technology and prevent avoidable blindness worldwide.
      </Typography>
    </Container>
  );
};

export default About;
