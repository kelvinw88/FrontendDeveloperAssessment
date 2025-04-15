import React from 'react';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import CompanyOverview from './components/CompanyOverview/CompanyOverview';
import HistoricalTrend from './components/HistoricalTrend/HistoricalTrend';
import IncidentTimeline from './components/IncidentTimeline/IncidentTimeline';
import CriticalIncidents from './components/CriticalIncidents/CriticalIncidents';
import useRiskData from './hooks/useRiskData';

const App: React.FC = () => {
  const { loading, error, riskData } = useRiskData();

  const {
    companyId,
    companyName,
    overallRiskScore,
    trend,
    lastUpdated,
    categories,
    loadingRiskData,
    errorRiskData,
    historicalData,
    loadingHistoricalData,
    errorHistoricalData,
    criticalIncidents,
    loadingCriticalIncidents,
    errorCriticalIncidents,
    incidents,
    loadingIncidents,
    errorIncidents,
    esgCategories,
    severityLevels,
  } = riskData;

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Failed to load data: {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        ESG Risk Dashboard
      </Typography>
      <CompanyOverview
        companyId={companyId}
        companyName={companyName}
        overallRiskScore={overallRiskScore}
        trend={trend}
        lastUpdated={lastUpdated}
        categories={categories}
        loadingRiskData={loadingRiskData}
        errorRiskData={errorRiskData}
      />
      <HistoricalTrend
        data={historicalData}
        loading={loadingHistoricalData}
        error={errorHistoricalData}
        width={800}
        height={500}
      />
      <CriticalIncidents
        criticalIncidents={criticalIncidents}
        loadingCriticalIncidents={loadingCriticalIncidents}
        errorCriticalIncidents={errorCriticalIncidents}
        incidents={incidents}
      />
      <IncidentTimeline
        incidents={incidents}
        loadingIncidents={loadingIncidents}
        errorIncidents={errorIncidents}
        esgCategories={esgCategories}
        severityLevels={severityLevels}
      />
    </Container>
  );
};

export default App;