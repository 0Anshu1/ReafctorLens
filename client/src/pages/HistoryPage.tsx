import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import { analysisService } from '../services/analysisService';
import { AnalysisResult } from '../contexts/AnalysisContext';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery(
    ['analyses', page, limit],
    () => analysisService.getAnalyses(page, limit),
    {
      keepPreviousData: true,
    }
  );

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await analysisService.deleteAnalysis(id);
      // The query will automatically refetch due to react-query's cache invalidation
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getLevelDescription = (level: number) => {
    const descriptions = ['None/Trivial', 'Minor', 'Moderate', 'Significant', 'Architectural'];
    return descriptions[level] || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading analysis history...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">
          Failed to load analysis history: {(error as Error).message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Analysis History
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              View and manage your previous code analysis results
            </Typography>
          </Box>
        </motion.div>

        {!data?.analyses || data.analyses.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Analysis History
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  You haven't run any code analyses yet. Start by analyzing your first code comparison.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/analyze')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                  }}
                >
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <Grid container spacing={3}>
              {data.analyses.map((analysis: AnalysisResult) => (
                <Grid item xs={12} sm={6} lg={4} key={analysis.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip
                            label={analysis.status.toUpperCase()}
                            color={getStatusColor(analysis.status)}
                            size="small"
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Analysis">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/analysis/${analysis.id}`)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Analysis">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteAnalysis(analysis.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CodeIcon color="primary" />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {analysis.language.toUpperCase()}
                          </Typography>
                        </Box>

                        {analysis.overallScore !== undefined && (
                          <Box sx={{ mb: 2 }}>
                            <Typography color="text.secondary" variant="body2">
                              Impact Score
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {analysis.overallScore}
                            </Typography>
                            {analysis.level !== undefined && (
                              <Typography color="text.secondary" variant="body2">
                                Level: {getLevelDescription(analysis.level)}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {analysis.summary && (
                          <Typography
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {analysis.summary}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(analysis.createdAt)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          onClick={() => navigate(`/analysis/${analysis.id}`)}
                          sx={{ borderRadius: 2 }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {data.pagination && data.pagination.pages > 1 && (
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    variant="outlined"
                  >
                    Previous
                  </Button>
                  <Typography sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                    Page {page} of {data.pagination.pages}
                  </Typography>
                  <Button
                    disabled={page === data.pagination.pages}
                    onClick={() => setPage(page + 1)}
                    variant="outlined"
                  >
                    Next
                  </Button>
                </Box>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default HistoryPage;

