import React from 'react';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import CompanyOverview from './features/CompanyOverview/CompanyOverview';
import HistoricalTrend from './features/HistoricalTrend/HistoricalTrend';
import IncidentTimeline from './features/IncidentTimeline/IncidentTimeline';
import CriticalIncidents from './features/CriticalIncidents/CriticalIncidents';
import useRiskData from './hooks/useRiskData';

const App: React.FC = () => {
  const { error, riskData } = useRiskData();

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