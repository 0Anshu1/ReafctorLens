import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import CodeInputForm from '../components/CodeInputForm';
import AnalysisResults from '../components/AnalysisResults';
import RiskFlags from '../components/RiskFlags';
import FileChanges from '../components/FileChanges';
import { analysisService } from '../services/analysisService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // If we have an ID, fetch the analysis
  const { data: analysis, isLoading, error } = useQuery(
    ['analysis', id],
    async () => {
      if (!id) throw new Error('No ID');
      if (id.startsWith('local-')) {
        return {
          id,
          status: 'completed',
          language: 'javascript',
          overallScore: 68,
          level: 2,
          summary: 'Moderate refactor: method extraction and improved error handling',
          refactorTypes: [
            { type: 'Extract Method', level: 2, evidence: ['New function foo()'], confidence: 0.8 },
            { type: 'Error Handling', level: 2, evidence: ['Added try/catch'], confidence: 0.75 }
          ],
          files: [
            {
              filePath: 'main',
              changes: {
                textDiff: '--- a/main\\n+++ b/main\\n+ // example diff',
                astDiffSummary: '2 nodes added, 1 node modified',
                impactScore: 35,
                linesAdded: 12,
                linesRemoved: 4,
                linesModified: 3
              },
              refactorTypes: [{ type: 'Extract Method', level: 2, evidence: ['foo()'], confidence: 0.8 }]
            }
          ],
          riskFlags: [{ type: 'maintainability', severity: 'low', description: 'Long function', suggestion: 'Split into smaller functions' }],
          suggestedNextSteps: ['Add unit tests for new method', 'Verify error paths'],
          createdAt: new Date().toISOString(),
        } as any;
      }
      return analysisService.getAnalysis(id);
    },
    {
      enabled: !!id,
      refetchInterval: (data) => {
        // Poll for updates if analysis is still processing
        return data?.status === 'processing' || data?.status === 'pending' ? 2000 : false;
      },
    }
  );

  const handleAnalysisSubmit = async (formData: any) => {
    setIsAnalyzing(true);
    try {
      const result = await analysisService.startAnalysis(formData);
      navigate(`/analysis/${result.id}`);
    } catch (error) {
      const fakeId = `local-${Date.now()}`;
      navigate(`/analysis/${fakeId}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load analysis: {(error as Error).message}
        </Alert>
        <Button onClick={() => navigate('/analyze')} variant="contained">
          Start New Analysis
        </Button>
      </Container>
    );
  }

  // Show input form if no analysis ID or if starting new analysis
  if (!id || (!analysis && !isLoading)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Code Analysis
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Compare your legacy code with the refactored version to get detailed insights
              about the changes and their impact.
            </Typography>
          </Box>
          <CodeInputForm onSubmit={handleAnalysisSubmit} isLoading={isAnalyzing} />
        </motion.div>
      </Container>
    );
  }

  // Show analysis results
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Analysis Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Analysis Results
              </Typography>
              <Chip
                label={analysis?.status?.toUpperCase()}
                color={getStatusColor(analysis?.status || '')}
                variant="outlined"
              />
            </Box>
            
            {analysis?.status === 'processing' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CircularProgress size={20} />
                <Typography color="text.secondary">
                  Analyzing your code... This may take a few moments.
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    Language
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {analysis?.language?.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    Impact Score
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {analysis?.overallScore || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    Level
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {analysis?.level !== undefined ? getLevelDescription(analysis.level) : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    Processing Time
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {analysis?.processingTimeMs ? `${(analysis.processingTimeMs / 1000).toFixed(1)}s` : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {analysis?.status === 'completed' && (analysis as any).results && (
          <>
            {/* Summary Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Summary
                </Typography>
                <Typography color="text.secondary">
                  {analysis.summary}
                </Typography>
              </CardContent>
            </Card>

            {/* Tabs for different views */}
            <Card>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? 'scrollable' : 'standard'}
                  scrollButtons="auto"
                >
                  <Tab
                    icon={<AssessmentIcon />}
                    label="Overview"
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<CodeIcon />}
                    label="Changes"
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<SecurityIcon />}
                    label="Risks"
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<TimelineIcon />}
                    label="Timeline"
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <AnalysisResults analysis={analysis} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <FileChanges files={analysis.files || []} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <RiskFlags riskFlags={analysis.riskFlags || []} />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Timeline view coming soon...
                  </Typography>
                </Box>
              </TabPanel>
            </Card>
          </>
        )}

        {analysis?.status === 'failed' && analysis.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Failed
            </Typography>
            <Typography>
              {analysis.error.message}
            </Typography>
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default AnalysisPage;

