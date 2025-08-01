import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  CameraAlt,
  Delete,
  Preview,
  CheckCircle,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DropzoneContainer = styled(Paper)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? theme.palette.primary.light + '10' : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '05',
  },
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: 300,
  borderRadius: 8,
  objectFit: 'contain',
});

const ImageUpload = ({ onImageSelect, selectedImage, loading }) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const webcamRef = useRef(null);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert('Please upload a valid image file (JPG, PNG, GIF)');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Capture photo from webcam
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          onImageSelect(file);
          setCameraOpen(false);
        });
    }
  }, [onImageSelect]);

  // Remove selected image
  const removeImage = () => {
    onImageSelect(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📸 Upload Eye Image
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please upload a clear photo of the affected eye. Ensure good lighting and focus on the eye area.
      </Typography>

      {!selectedImage ? (
        <Grid container spacing={2}>
          {/* File Upload Dropzone */}
          <Grid item xs={12} md={8}>
            <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              {isDragActive ? (
                <Typography variant="h6" color="primary">
                  Drop the image here...
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Drag & drop an eye image here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to select from your device
                  </Typography>
                </>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Supported: JPG, PNG, GIF • Max size: 10MB
                </Typography>
              </Box>
            </DropzoneContainer>
          </Grid>

          {/* Camera Option */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                onClick={() => setCameraOpen(true)}
                size="large"
                fullWidth
                sx={{ height: 100 }}
              >
                Use Camera
              </Button>
              
              <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
                💡 <strong>Tips:</strong>
                <br />• Ensure good lighting
                <br />• Focus on the eye area
                <br />• Avoid reflections
                <br />• Keep image stable
              </Alert>
            </Box>
          </Grid>
        </Grid>
      ) : (
        /* Image Preview */
        <Paper sx={{ p: 2, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              <Typography variant="subtitle1" color="success.main">
                Image Selected
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => setPreviewOpen(true)} color="primary">
                <Preview />
              </IconButton>
              <IconButton onClick={removeImage} color="error">
                <Delete />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <PreviewImage
              src={URL.createObjectURL(selectedImage)}
              alt="Selected eye image"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            {selectedImage.name} • {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Processing image...</Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Camera Dialog */}
      <Dialog 
        open={cameraOpen} 
        onClose={() => setCameraOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>📷 Capture Eye Image</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              Position your eye in the center of the frame. Ensure good lighting and focus.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCameraOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={capturePhoto} 
            variant="contained"
            startIcon={<CameraAlt />}
          >
            Capture Photo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <PreviewImage
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUpload;
