import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { FileChange } from '../contexts/AnalysisContext';

interface FileChangesProps {
  files: FileChange[];
}

const FileChanges: React.FC<FileChangesProps> = ({ files }) => {
  const theme = useTheme();
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const handleAccordionChange = (filePath: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  // Helper retained for future use if we build custom diff rendering
  const parseDiff = (diffText: string) => {
    const lines = diffText.split('\n');
    return {
      added: lines.filter(l => l.startsWith('+') && !l.startsWith('+++')),
      removed: lines.filter(l => l.startsWith('-') && !l.startsWith('---')),
      context: lines.filter(l => !l.startsWith('+') && !l.startsWith('-')),
    };
  };

  const getImpactColor = (score: number) => {
    if (score >= 80) return 'error';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'info';
    return 'success';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  if (!files || files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No File Changes Detected
          </Typography>
          <Typography color="text.secondary">
            No significant file-level changes were found in this analysis.
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        File Changes ({files.length})
      </Typography>

      {files.map((file, index) => (
        <motion.div key={file.filePath} variants={itemVariants}>
          <Accordion
            expanded={expandedFiles.has(file.filePath)}
            onChange={() => handleAccordionChange(file.filePath)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: theme.palette.grey[50],
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <CodeIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                  {file.filePath}
                </Typography>
                
                <Grid container spacing={2} sx={{ maxWidth: 400 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon fontSize="small" color="success" />
                      <Typography variant="body2" color="success.main">
                        +{file.changes.linesAdded}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingDownIcon fontSize="small" color="error" />
                      <Typography variant="body2" color="error.main">
                        -{file.changes.linesRemoved}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EditIcon fontSize="small" color="info" />
                      <Typography variant="body2" color="info.main">
                        {file.changes.linesModified}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Chip
                  label={`Impact: ${file.changes.impactScore}`}
                  color={getImpactColor(file.changes.impactScore)}
                  size="small"
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ width: '100%' }}>
                {/* AST Diff Summary */}
                {file.changes.astDiffSummary && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        AST Diff Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {file.changes.astDiffSummary}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Refactor Types */}
                {file.refactorTypes && file.refactorTypes.length > 0 && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Detected Refactor Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {file.refactorTypes.map((refactor, refactorIndex) => (
                          <Chip
                            key={refactorIndex}
                            label={`${refactor.type} (Level ${refactor.level})`}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Code Diff */}
                {file.changes.textDiff && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Code Changes
                    </Typography>
                    <Box
                      sx={{
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <SyntaxHighlighter
                        language="diff"
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                        }}
                        wrapLines
                        wrapLongLines
                      >
                        {file.changes.textDiff}
                      </SyntaxHighlighter>
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FileChanges;

