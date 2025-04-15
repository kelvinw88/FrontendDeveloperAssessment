import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRiskData,
  setLoadingRiskData,
  setLoadingIncidents,
  setLoadingHistoricalData,
  setErrorRiskData,
  setErrorIncidents,
  setErrorHistoricalData,
  setLoadingEsgCategories,
  setErrorEsgCategories,
  setLoadingSeverityLevels,
  setErrorSeverityLevels
} from './features/riskSlice';
import { RootState } from './store';
import { fetchRiskData, fetchIncidents, fetchRiskScoreHistory, fetchEsgCategories, fetchSeverityLevels } from './services/api';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import CompanyOverview from './components/CompanyOverview/CompanyOverview';
import HistoricalTrend from './components/HistoricalTrend/HistoricalTrend';
import IncidentTimeline from './components/IncidentTimeline/IncidentTimeline';
import CriticalIncidents from './components/CriticalIncidents/CriticalIncidents';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {
    loadingRiskData,
    loadingIncidents,
    loadingHistoricalData,
    loadingEsgCategories,
    loadingSeverityLevels,
    errorRiskData,
    errorIncidents,
    errorHistoricalData,
    errorEsgCategories,
    errorSeverityLevels,
  } = useSelector((state: RootState) => state.risk);

  useEffect(() => {
    const loadData = async () => {
      // Fetch risk data
      dispatch(setLoadingRiskData());
      try {
        const riskData = await fetchRiskData();
        dispatch(setRiskData({ ...riskData, loadingRiskData: false }));
      } catch (err) {
        dispatch(setErrorRiskData(err instanceof Error ? err.message : 'Unknown error'));
      }

      // Fetch incidents
      dispatch(setLoadingIncidents());
      try {
        const incidents = await fetchIncidents();
        dispatch(setRiskData({ incidents, loadingIncidents: false }));
      } catch (err) {
        dispatch(setErrorIncidents(err instanceof Error ? err.message : 'Unknown error'));
      }

      // Fetch historical data
      dispatch(setLoadingHistoricalData());
      try {
        const historicalData = await fetchRiskScoreHistory();
        dispatch(setRiskData({ historicalData, loadingHistoricalData: false }));
      } catch (err) {
        dispatch(setErrorHistoricalData(err instanceof Error ? err.message : 'Unknown error'));
      }

      // Fetch ESG Categories
      dispatch(setLoadingEsgCategories());
      try {
        const esgCategories = await fetchEsgCategories();
        dispatch(setRiskData({ esgCategories, loadingEsgCategories: false }));
      } catch (err) {
        dispatch(setErrorEsgCategories(err instanceof Error ? err.message : 'Unknown error'));
      }
  
      // Fetch Severity Levels
      dispatch(setLoadingSeverityLevels());
      try {
        const severityLevels = await fetchSeverityLevels();
        dispatch(setRiskData({ severityLevels, loadingSeverityLevels: false }));
      } catch (err) {
        dispatch(setErrorSeverityLevels(err instanceof Error ? err.message : 'Unknown error'));
      }
    };
    loadData();
  }, [dispatch]);

  // Show global loading only if all APIs are loading and no errors
  if (
    loadingRiskData &&
    loadingIncidents &&
    loadingHistoricalData &&
    loadingEsgCategories &&
    loadingSeverityLevels &&
    !errorRiskData &&
    !errorIncidents &&
    !errorHistoricalData &&
    !errorEsgCategories &&
    !errorSeverityLevels
  ) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        ESG Risk Dashboard
      </Typography>
      <CompanyOverview />
      <HistoricalTrend />
      <CriticalIncidents />
      <IncidentTimeline />
    </Container>
  );
};

export default App;