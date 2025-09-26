import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Grid,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import { RiskFlag } from '../contexts/AnalysisContext';

interface RiskFlagsProps {
  riskFlags: RiskFlag[];
}

const RiskFlags: React.FC<RiskFlagsProps> = ({ riskFlags }) => {
  const theme = useTheme();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getSeverityColor = (severity: string): 'success' | 'error' | 'info' | 'warning' | undefined => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <SecurityIcon />;
      case 'license':
        return <WarningIcon />;
      case 'compatibility':
        return <InfoIcon />;
      case 'performance':
        return <WarningIcon />;
      case 'maintainability':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getTypeColor = (type: string): 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
    switch (type) {
      case 'security':
        return 'error';
      case 'license':
        return 'warning';
      case 'compatibility':
        return 'info';
      case 'performance':
        return 'warning';
      case 'maintainability':
        return 'info';
      default:
        return 'default';
    }
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

  if (!riskFlags || riskFlags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="h6" gutterBottom>
            No Risk Flags Detected
          </Typography>
          <Typography>
            Great! No security vulnerabilities, licensing issues, or compatibility concerns were found in your refactored code.
          </Typography>
        </Alert>
      </motion.div>
    );
  }

  // Group flags by severity
  const flagsBySeverity = riskFlags.reduce((acc, flag) => {
    if (!acc[flag.severity]) {
      acc[flag.severity] = [];
    }
    acc[flag.severity].push(flag);
    return acc;
  }, {} as Record<string, RiskFlag[]>);

  // Group flags by type
  const flagsByType = riskFlags.reduce((acc, flag) => {
    if (!acc[flag.type]) {
      acc[flag.type] = [];
    }
    acc[flag.type].push(flag);
    return acc;
  }, {} as Record<string, RiskFlag[]>);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Summary */}
      <motion.div variants={itemVariants}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Risk Assessment Summary
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(flagsBySeverity).map(([severity, flags]) => (
                <Grid item xs={12} sm={6} md={3} key={severity}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {getSeverityIcon(severity)}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {flags.length}
                    </Typography>
                    <Typography color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {severity} Issues
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Flags by Type */}
      {Object.entries(flagsByType).map(([type, flags]) => (
        <motion.div key={type} variants={itemVariants}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {getTypeIcon(type)}
                <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {type} Issues
                </Typography>
                <Chip
                  label={flags.length}
                  color={getTypeColor(type)}
                  size="small"
                />
              </Box>

              {flags.map((flag, index) => (
                <Alert
                  key={index}
                  severity={getSeverityColor(flag.severity) as any}
                  sx={{ mb: 2 }}
                  icon={getSeverityIcon(flag.severity)}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {flag.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Suggestion:</strong> {flag.suggestion}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={flag.severity.toUpperCase()}
                        color={getSeverityColor(flag.severity)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={flag.type.toUpperCase()}
                        color={getTypeColor(flag.type)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            General Recommendations
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Address critical and high severity issues before deployment
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Review licensing implications for any new dependencies
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Test compatibility across your target environments
          </Typography>
          <Typography variant="body2">
            • Consider security best practices for production deployment
          </Typography>
        </Alert>
      </motion.div>
    </motion.div>
  );
};

export default RiskFlags;

