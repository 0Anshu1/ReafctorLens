import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Code as CodeIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

import { AnalysisRequest } from '../services/analysisService';

interface CodeInputFormProps {
  onSubmit: (data: AnalysisRequest) => void;
  isLoading: boolean;
}

const CodeInputForm: React.FC<CodeInputFormProps> = ({ onSubmit, isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [legacyLanguage, setLegacyLanguage] = useState('javascript');
  const [refactoredLanguage, setRefactoredLanguage] = useState('javascript');
  const [legacyType, setLegacyType] = useState<'paste' | 'file' | 'repo'>('paste');
  const [refactoredType, setRefactoredType] = useState<'paste' | 'file' | 'repo'>('paste');
  const [legacyCode, setLegacyCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [legacyRepo, setLegacyRepo] = useState({ url: '', ref: 'main' });
  const [refactoredRepo, setRefactoredRepo] = useState({ url: '', ref: 'main' });
  const [legacyFiles, setLegacyFiles] = useState<File[]>([]);
  const [refactoredFiles, setRefactoredFiles] = useState<File[]>([]);
  const [options, setOptions] = useState({
    analyzeTests: true,
    runStaticChecks: false,
    includeSecurityScan: true,
  });

  const languages = [
    { value: 'javascript', label: 'JavaScript/TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'cobol', label: 'COBOL' },
    { value: 'pli', label: 'PL/I' },
  ];

  const handleLegacyDrop = useDropzone({
    accept: {
      'text/*': ['.js', '.ts', '.java', '.py', '.c', '.cpp', '.cs', '.cob', '.pli'],
    },
    onDrop: (acceptedFiles) => {
      setLegacyFiles(acceptedFiles);
    },
  });

  const handleRefactoredDrop = useDropzone({
    accept: {
      'text/*': ['.js', '.ts', '.java', '.py', '.c', '.cpp', '.cs', '.cob', '.pli'],
    },
    onDrop: (acceptedFiles) => {
      setRefactoredFiles(acceptedFiles);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: AnalysisRequest = {
      // Use legacy language as primary; send both in options for clarity
      language: legacyLanguage,
      legacy: {
        type: legacyType,
        content: legacyType === 'paste' ? legacyCode : undefined,
        url: legacyType === 'repo' ? legacyRepo.url : undefined,
        ref: legacyType === 'repo' ? legacyRepo.ref : undefined,
        files: legacyType === 'file' ? legacyFiles.map(f => f.name) : undefined,
      },
      refactored: {
        type: refactoredType,
        content: refactoredType === 'paste' ? refactoredCode : undefined,
        url: refactoredType === 'repo' ? refactoredRepo.url : undefined,
        ref: refactoredType === 'repo' ? refactoredRepo.ref : undefined,
        files: refactoredType === 'file' ? refactoredFiles.map(f => f.name) : undefined,
      },
      options: {
        ...options,
        sourceLanguage: legacyLanguage as any,
        targetLanguage: refactoredLanguage as any,
      },
    };

    onSubmit(request);
  };

  const removeFile = (fileList: File[], setFileList: (files: File[]) => void, index: number) => {
    const newFiles = fileList.filter((_, i) => i !== index);
    setFileList(newFiles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Analysis Configuration
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Language Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Legacy Language</InputLabel>
                  <Select
                    value={legacyLanguage}
                    label="Legacy Language"
                    onChange={(e) => setLegacyLanguage(e.target.value as any)}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Refactored Language</InputLabel>
                  <Select
                    value={refactoredLanguage}
                    label="Refactored Language"
                    onChange={(e) => setRefactoredLanguage(e.target.value as any)}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Options */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Tooltip title="Include test files when mapping changes and scoring (slower, more detail)">
                    <Button
                      variant={options.analyzeTests ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setOptions({ ...options, analyzeTests: !options.analyzeTests })}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Analyze Tests
                    </Button>
                  </Tooltip>
                  <Tooltip title="Run static checks for secrets, deprecated crypto, SQL injection, and compatibility">
                    <Button
                      variant={options.includeSecurityScan ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setOptions({ ...options, includeSecurityScan: !options.includeSecurityScan })}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Security Scan
                    </Button>
                  </Tooltip>
                </Box>
              </Grid>

              {/* Legacy Code Input */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon color="primary" />
                  Legacy Code
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Input Type</InputLabel>
                  <Select
                    value={legacyType}
                    label="Input Type"
                    onChange={(e) => setLegacyType(e.target.value as any)}
                  >
                    <MenuItem value="paste">Paste Code</MenuItem>
                    <MenuItem value="file">Upload Files</MenuItem>
                    <MenuItem value="repo">Git Repository</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                {legacyType === 'repo' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Repository URL"
                      placeholder="https://github.com/user/repo"
                      value={legacyRepo.url}
                      onChange={(e) => setLegacyRepo({ ...legacyRepo, url: e.target.value })}
                    />
                    <TextField
                      label="Branch/Tag"
                      placeholder="main"
                      value={legacyRepo.ref}
                      onChange={(e) => setLegacyRepo({ ...legacyRepo, ref: e.target.value })}
                      sx={{ minWidth: 120 }}
                    />
                  </Box>
                )}
              </Grid>

              {legacyType === 'paste' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Legacy Code"
                    placeholder="Paste your legacy code here..."
                    value={legacyCode}
                    onChange={(e) => setLegacyCode(e.target.value)}
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
              )}

              {legacyType === 'file' && (
                <Grid item xs={12}>
                  <Paper
                    {...handleLegacyDrop.getRootProps()}
                    sx={{
                      p: 3,
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'primary.light',
                      '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                    }}
                  >
                    <input {...handleLegacyDrop.getInputProps()} />
                    <UploadIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Drop legacy code files here
                    </Typography>
                    <Typography color="text.secondary">
                      or click to select files
                    </Typography>
                  </Paper>

                  {legacyFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Selected Files:
                      </Typography>
                      {legacyFiles.map((file, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2">{file.name}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeFile(legacyFiles, setLegacyFiles, index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              )}

              {/* Refactored Code Input */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon color="secondary" />
                  Refactored Code
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Input Type</InputLabel>
                  <Select
                    value={refactoredType}
                    label="Input Type"
                    onChange={(e) => setRefactoredType(e.target.value as any)}
                  >
                    <MenuItem value="paste">Paste Code</MenuItem>
                    <MenuItem value="file">Upload Files</MenuItem>
                    <MenuItem value="repo">Git Repository</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                {refactoredType === 'repo' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Repository URL"
                      placeholder="https://github.com/user/repo"
                      value={refactoredRepo.url}
                      onChange={(e) => setRefactoredRepo({ ...refactoredRepo, url: e.target.value })}
                    />
                    <TextField
                      label="Branch/Tag"
                      placeholder="main"
                      value={refactoredRepo.ref}
                      onChange={(e) => setRefactoredRepo({ ...refactoredRepo, ref: e.target.value })}
                      sx={{ minWidth: 120 }}
                    />
                  </Box>
                )}
              </Grid>

              {refactoredType === 'paste' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Refactored Code"
                    placeholder="Paste your refactored code here..."
                    value={refactoredCode}
                    onChange={(e) => setRefactoredCode(e.target.value)}
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
              )}

              {refactoredType === 'file' && (
                <Grid item xs={12}>
                  <Paper
                    {...handleRefactoredDrop.getRootProps()}
                    sx={{
                      p: 3,
                      border: '2px dashed',
                      borderColor: 'secondary.main',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'secondary.light',
                      '&:hover': { backgroundColor: 'secondary.main', color: 'white' },
                    }}
                  >
                    <input {...handleRefactoredDrop.getInputProps()} />
                    <UploadIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Drop refactored code files here
                    </Typography>
                    <Typography color="text.secondary">
                      or click to select files
                    </Typography>
                  </Paper>

                  {refactoredFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Selected Files:
                      </Typography>
                      {refactoredFiles.map((file, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2">{file.name}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeFile(refactoredFiles, setRefactoredFiles, index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? 'Analyzing...' : 'Start Analysis'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CodeInputForm;

