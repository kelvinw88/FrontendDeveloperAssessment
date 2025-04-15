import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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

const CompanyOverview: React.FC = () => {
  const {
    companyId,
    companyName,
    overallRiskScore,
    trend,
    lastUpdated,
    categories,
    loadingRiskData,
    errorRiskData,
  } = useSelector((state: RootState) => state.risk);

  const getTrendIcon = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'increasing':
        return <ArrowUpwardIcon color="error" fontSize="small" />;
      case 'decreasing':
        return <ArrowDownwardIcon color="success" fontSize="small" />;
      default:
        return <TrendingFlatIcon color="action" fontSize="small" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return 'error.main';
    if (score > 50) return 'warning.main';
    return 'success.main';
  };

  if (loadingRiskData) {
    return (
      <Card sx={{ mb: 3 }} role="region" aria-label="Company Risk Overview">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Company Risk Overview
          </Typography>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (errorRiskData) {
    return (
      <Card sx={{ mb: 3 }} role="region" aria-label="Company Risk Overview">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Company Risk Overview
          </Typography>
          <Typography color="error">{errorRiskData}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{ mb: 3 }}
      role="region"
      aria-label="Company Risk Overview"
      elevation={2}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company Risk Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Company Name
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {companyName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Company ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {companyId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Overall Risk Score
            </Typography>
            <Typography
              variant="h5"
              color={getScoreColor(overallRiskScore)}
              aria-label={`Overall risk score: ${overallRiskScore}`}
            >
              {overallRiskScore || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary">
              Trend
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {getTrendIcon(trend?.direction || '')}
              <Typography variant="body1">
                {trend?.direction
                  ? `${trend.direction} by ${trend.percentage || 0}%`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
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
          {[
            { name: 'Environmental', data: categories?.environmental },
            { name: 'Social', data: categories?.social },
            { name: 'Governance', data: categories?.governance },
          ].map(({ name, data }) => (
            <Grid item xs={12} sm={4} key={name}>
              <Typography variant="body1" color="textSecondary">
                {name}
              </Typography>
              <Typography
                variant="body1"
                color={data?.score ? getScoreColor(data.score) : 'textPrimary'}
              >
                Score: {data?.score ?? 'N/A'}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {getTrendIcon(data?.trend || '')}
                <Typography variant="body2">
                  {data?.trend
                    ? `${data.trend} by ${data.changePercentage || 0}%`
                    : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyOverview;