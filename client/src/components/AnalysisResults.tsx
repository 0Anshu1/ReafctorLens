import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

import { AnalysisResult, RefactorType } from '../contexts/AnalysisContext';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const theme = useTheme();

  const getLevelColor = (level: number): 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
    const map: Record<number, 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'> = {
      0: 'default',
      1: 'info',
      2: 'warning',
      3: 'primary',
      4: 'error',
    };
    return map[level] ?? 'default';
  };

  const getLevelDescription = (level: number) => {
    const descriptions = ['None/Trivial', 'Minor', 'Moderate', 'Significant', 'Architectural'];
    return descriptions[level] || 'Unknown';
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

  const resultsAny = (analysis as any).results;
  if (!resultsAny) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No analysis results available
        </Typography>
      </Box>
    );
  }

  const results = resultsAny as any;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overall Metrics */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {results.overallScore}
                </Typography>
                <Typography color="text.secondary">Impact Score</Typography>
                <LinearProgress
                  variant="determinate"
                  value={results.overallScore}
                  sx={{ mt: 1, borderRadius: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {results.level}
                </Typography>
                <Typography color="text.secondary">
                  Level: {getLevelDescription(results.level || 0)}
                </Typography>
                <Chip
                  label={getLevelDescription(results.level || 0)}
                  color={getLevelColor(results.level || 0)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <CodeIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {results.metrics?.filesModified || 0}
                </Typography>
                <Typography color="text.secondary">Files Modified</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <SecurityIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {results.riskFlags?.length || 0}
                </Typography>
                <Typography color="text.secondary">Risk Flags</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Refactor Types */}
      {results.refactorTypes && results.refactorTypes.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Detected Refactoring Types
              </Typography>
              <Grid container spacing={2}>
                {results.refactorTypes.map((refactor: RefactorType, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {refactor.type}
                          </Typography>
                          <Chip
                            label={`Level ${refactor.level}`}
                            color={getLevelColor(refactor.level)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Confidence: {Math.round(refactor.confidence * 100)}%
                        </Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Evidence:
                          </Typography>
                          {refactor.evidence.slice(0, 2).map((evidence: string, i: number) => (
                            <Typography key={i} variant="caption" display="block" color="text.secondary">
                              • {evidence}
                            </Typography>
                          ))}
                          {refactor.evidence.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{refactor.evidence.length - 2} more
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Metrics */}
      {results.metrics && (
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Detailed Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Lines Changed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.metrics.totalLinesChanged || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      New Dependencies
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.metrics.newDependencies?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Removed Dependencies
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.metrics.removedDependencies?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Complexity Delta
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: (results.metrics.cyclomaticComplexityDelta || 0) > 0 ? 'error.main' : 'success.main'
                      }}
                    >
                      {(results.metrics.cyclomaticComplexityDelta || 0) > 0 ? '+' : ''}{results.metrics.cyclomaticComplexityDelta || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Suggested Next Steps */}
      {results.suggestedNextSteps && results.suggestedNextSteps.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Suggested Next Steps
              </Typography>
              {results.suggestedNextSteps.map((step: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Typography sx={{ mr: 1, mt: 0.5 }}>•</Typography>
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalysisResults;

