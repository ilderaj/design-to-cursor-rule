import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Container, Paper, Button, CircularProgress, TextField, alpha, keyframes } from '@mui/material';
import * as tf from '@tensorflow/tfjs';

// Services imports
import { analyzeDesign } from '../services/designAnalyzer';
import { generateCursorRule } from '../services/ruleGenerator';
import { DesignElements } from '../utils/types';

// Animation for pulse effect
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [designElements, setDesignElements] = useState<DesignElements | null>(null);
  const [cursorRule, setCursorRule] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          setIsAnalyzing(true);
          setDesignElements(null);
          setCursorRule('');
          
          try {
            // Load TensorFlow.js model
            await tf.ready();
            
            // Mock design analysis - in a real app, this would be actual ML analysis
            const analyzedElements = await analyzeDesign(e.target.result as string);
            setDesignElements(analyzedElements);
            
            // Generate Cursor rule
            const rule = generateCursorRule(analyzedElements);
            setCursorRule(rule);
          } catch (error) {
            console.error('Error analyzing design:', error);
          } finally {
            setIsAnalyzing(false);
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cursorRule);
    setCopied(true);
  };

  // Get dropzone border color based on state
  const getBorderColor = () => {
    if (isDragAccept) return 'success.main';
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'divider';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" 
        sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
        Design to Cursor Rule
      </Typography>
      
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Upload a design image to generate Cursor rules matching the design language
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Paper 
          {...getRootProps()} 
          elevation={3} 
          sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            p: 4,
            minHeight: 300,
            cursor: 'pointer',
            bgcolor: isDragActive ? alpha('#1976d2', 0.05) : 'background.paper',
            border: '2px dashed',
            borderColor: getBorderColor(),
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'scale(1.01)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            },
            ...(isDragActive && {
              animation: `${pulse} 1.5s infinite`
            })
          }}
        >
          <input {...getInputProps()} />
          
          {image ? (
            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src={image} 
                alt="Uploaded design" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  maxHeight: 300,
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease'
                }} 
              />
              {isAnalyzing && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: '8px'
                }}>
                  <CircularProgress color="primary" />
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: alpha('#1976d2', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976d2">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#1976d2"/>
                </svg>
              </Box>
              <Typography variant="h6" gutterBottom>
                Drag & drop design image here
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                or click to select a file
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Supports PNG, JPG, JPEG, WebP
              </Typography>
            </>
          )}
        </Paper>
        
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1,
            p: 3,
            height: 'auto',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 1 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '8px' }} fill="#1976d2">
              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
            </svg>
            Detected Design Elements
          </Typography>
          
          {isAnalyzing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : designElements ? (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Colors:</span>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {designElements.colors.map((color, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: color, 
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                    title={color}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Typography:</span>
              </Typography>
              <Box sx={{ mb: 2, pl: 2, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Font Families:</strong> {designElements.typography.fontFamily.join(', ')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Font Sizes:</strong> {designElements.typography.fontSizes.join('px, ')}px
                </Typography>
                <Typography variant="body2">
                  <strong>Font Weights:</strong> {designElements.typography.fontWeights.join(', ')}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Components:</span>
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {designElements.components.map((component, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      bgcolor: alpha('#1976d2', 0.1), 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: '16px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {component}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              opacity: 0.7 
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#9e9e9e">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
              </svg>
              <Typography variant="body1" color="text.secondary" mt={2}>
                Upload an image to analyze design elements
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '8px', 
          transition: 'all 0.3s ease',
          bgcolor: cursorRule ? 'background.paper' : alpha('#f5f5f5', 0.7)
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          pb: 1 
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '8px' }} fill="#1976d2">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
          Generated Cursor Rule
        </Typography>
        
        <TextField
          multiline
          fullWidth
          rows={10}
          variant="outlined"
          value={cursorRule}
          InputProps={{
            readOnly: true,
            sx: { 
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              bgcolor: alpha('#1976d2', 0.03)
            }
          }}
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          color={copied ? "success" : "primary"}
          onClick={copyToClipboard}
          disabled={!cursorRule}
          startIcon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {copied ? 
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/> : 
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              }
            </svg>
          }
          sx={{ 
            transition: 'all 0.3s ease',
            minWidth: '120px',
            boxShadow: copied ? '0 4px 8px rgba(0,200,83,0.3)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {copied ? "Copied!" : "Copy Code"}
        </Button>
      </Paper>
    </Container>
  );
};

export default App; 