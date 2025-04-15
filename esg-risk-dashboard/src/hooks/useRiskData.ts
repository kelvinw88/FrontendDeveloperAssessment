import { useEffect } from 'react';
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
  setErrorSeverityLevels,
  setLoadingCriticalIncidents,
  setErrorCriticalIncidents,
  RiskState,
} from '../features/riskSlice';
import {
  fetchRiskData,
  fetchIncidents,
  fetchRiskScoreHistory,
  fetchEsgCategories,
  fetchSeverityLevels,
  fetchCriticalIncidents,
} from '../services/api';
import { RootState } from '../store';

interface RiskDataHookResult {
  loading: boolean;
  error: string | null;
  riskData: RiskState
};

const useRiskData = (): RiskDataHookResult => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoadingRiskData());
      try {
        const riskData = await fetchRiskData();
        dispatch(setRiskData({ ...riskData, loadingRiskData: false }));
      } catch (err) {
        dispatch(setErrorRiskData(err instanceof Error ? err.message : 'Unknown error'));
      }

      dispatch(setLoadingIncidents());
      try {
        const incidents = await fetchIncidents();
        dispatch(setRiskData({ incidents, loadingIncidents: false }));
      } catch (err) {
        dispatch(setErrorIncidents(err instanceof Error ? err.message : 'Unknown error'));
      }

      dispatch(setLoadingHistoricalData());
      try {
        const historicalData = await fetchRiskScoreHistory();
        dispatch(setRiskData({ historicalData, loadingHistoricalData: false }));
      } catch (err) {
        dispatch(setErrorHistoricalData(err instanceof Error ? err.message : 'Unknown error'));
      }

      dispatch(setLoadingEsgCategories());
      try {
        const esgCategories = await fetchEsgCategories();
        dispatch(setRiskData({ esgCategories, loadingEsgCategories: false }));
      } catch (err) {
        dispatch(setErrorEsgCategories(err instanceof Error ? err.message : 'Unknown error'));
      }

      dispatch(setLoadingSeverityLevels());
      try {
        const severityLevels = await fetchSeverityLevels();
        dispatch(setRiskData({ severityLevels, loadingSeverityLevels: false }));
      } catch (err) {
        dispatch(setErrorSeverityLevels(err instanceof Error ? err.message : 'Unknown error'));
      }

      dispatch(setLoadingCriticalIncidents());
      try {
        const criticalIncidents = await fetchCriticalIncidents();
        dispatch(setRiskData({ criticalIncidents, loadingCriticalIncidents: false }));
      } catch (err) {
        dispatch(setErrorCriticalIncidents(err instanceof Error ? err.message : 'Unknown error'));
      }
    };

    loadData();
  }, [dispatch]);

  // Determine the overall loading state
  const loading = useSelector((state: RootState) => (
    state.risk.loadingRiskData ||
    state.risk.loadingIncidents ||
    state.risk.loadingHistoricalData ||
    state.risk.loadingEsgCategories ||
    state.risk.loadingSeverityLevels ||
    state.risk.loadingCriticalIncidents
  ));

  // Determine if there is any error
  const error = useSelector((state: RootState) => (
    state.risk.errorRiskData ||
    state.risk.errorIncidents ||
    state.risk.errorHistoricalData ||
    state.risk.errorEsgCategories ||
    state.risk.errorSeverityLevels ||
    state.risk.errorCriticalIncidents
  ));

  const riskData = useSelector((state: RootState) => (state.risk as RiskState));

  return { loading, error, riskData };
};

export default useRiskData;