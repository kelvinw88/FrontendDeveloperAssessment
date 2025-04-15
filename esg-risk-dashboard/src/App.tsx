import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRiskData, setLoading, setError } from './features/riskSlice';
import { RootState } from './store';
import { fetchRiskData, fetchIncidents, fetchRiskScoreHistory } from './services/api';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import CompanyOverview from './components/CompanyOverview';
import HistoricalTrend from './components/HistoricalTrend';
import IncidentTimeline from './components/IncidentTimeline';
import CriticalIncidents from './components/CriticalIncidents';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.risk);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading());
      try {
        const [riskData, incidents, historicalData] = await Promise.all([
          fetchRiskData(),
          fetchIncidents(),
          fetchRiskScoreHistory(),
        ]);
        dispatch(setRiskData({ ...riskData, incidents, historicalData }));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Unknown error'));
      }
    };
    loadData();
  }, [dispatch]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        ESG Risk Dashboard
      </Typography>
      <CompanyOverview />
      <HistoricalTrend />
      <IncidentTimeline />
      <CriticalIncidents />
    </Container>
  );
};

export default App;