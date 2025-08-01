import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';

const Contact = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Name" margin="normal" />
          <TextField fullWidth label="Email" margin="normal" />
          <TextField fullWidth label="Subject" margin="normal" />
          <TextField 
            fullWidth 
            label="Message" 
            multiline 
            rows={4} 
            margin="normal" 
          />
          <Button variant="contained" sx={{ mt: 2 }}>
            Send Message
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions about SympFindX? We'd love to hear from you.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
