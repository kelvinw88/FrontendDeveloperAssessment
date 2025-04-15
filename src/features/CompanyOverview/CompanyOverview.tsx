import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { RiskState } from '../../store/riskSlice';

const getTrendIcon = (direction: string = '') => {
  switch (direction.toLowerCase()) {
    case 'increasing':
      return <ArrowUpwardIcon color="error" fontSize="small" />;
    case 'decreasing':
      return <ArrowDownwardIcon color="success" fontSize="small" />;
    default:
      return <TrendingFlatIcon color="action" fontSize="small" />;
  }
};

const getScoreColor = (score: number = 0) => {
  if (score > 70) return 'error.main';
  if (score > 50) return 'warning.main';
  return 'success.main';
};


const CategoryItem = ({ label, score, trend, changePercentage }) => (
  <Grid xs={12} sm={4}>
    <Typography variant="body1" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body1" color={score ? getScoreColor(score) : 'textPrimary'}>
      Score: {score ?? 'N/A'}
    </Typography>
    <Box display="flex" alignItems="center" gap={1}>
      {getTrendIcon(trend)}
      <Typography variant="body2">
        {trend ? `${trend} by ${changePercentage ?? 0}%` : 'N/A'}
      </Typography>
    </Box>
  </Grid>
);

const CompanyOverview: React.FC<Partial<RiskState>> = ({
  companyId,
  companyName,
  overallRiskScore,
  trend,
  lastUpdated,
  categories,
  loadingRiskData,
  errorRiskData,
}) => {
  if (loadingRiskData || errorRiskData) {
    return (
      <Card sx={{ mb: 3 }} role="region" aria-label="Company Risk Overview">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Company Risk Overview
          </Typography>
          {loadingRiskData ? (
            <CircularProgress size={24} />
          ) : (
            <Typography color="error">{errorRiskData}</Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }} role="region" aria-label="Company Risk Overview" elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company Risk Overview
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'Company Name', value: companyName },
            { label: 'Company ID', value: companyId },
          ].map(({ label, value }) => (
            <Grid xs={12} sm={6} key={label}>
              <Typography variant="body1" color="textSecondary">
                {label}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {value || 'N/A'}
              </Typography>
            </Grid>
          ))}

          <Grid xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Overall Risk Score
            </Typography>
            <Typography
              variant="h5"
              color={getScoreColor(overallRiskScore ?? 0)}
              aria-label={`Overall risk score: ${overallRiskScore}`}
            >
              {overallRiskScore ?? 0}
            </Typography>
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Trend
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {getTrendIcon(trend?.direction)}
              <Typography variant="body1">
                {trend?.direction
                  ? `${trend.direction} by ${trend.percentage ?? 0}%`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body1" color="textSecondary">
              Last Updated
            </Typography>
            <Typography variant="body1">
              {lastUpdated
                ? new Date(lastUpdated).toLocaleDateString()
                : 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ my: 2, borderBottom: 1, borderColor: 'divider' }} />
        <Typography variant="subtitle1" gutterBottom>
          ESG Categories
        </Typography>

        <Grid container spacing={2}>
          <CategoryItem label="Environmental" {...categories?.environmental} />
          <CategoryItem label="Social" {...categories?.social} />
          <CategoryItem label="Governance" {...categories?.governance} />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyOverview;
