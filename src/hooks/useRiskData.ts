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
} from '../store/riskSlice';
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
      // Set all loading states to true at once
      dispatch(setLoadingRiskData());
      dispatch(setLoadingIncidents());
      dispatch(setLoadingHistoricalData());
      dispatch(setLoadingEsgCategories());
      dispatch(setLoadingSeverityLevels());
      dispatch(setLoadingCriticalIncidents());
  
      // Fire all requests simultaneously
      const requests = [
        fetchRiskData().then(data => {
          dispatch(setRiskData({ ...data, loadingRiskData: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorRiskData(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        }),
  
        fetchIncidents().then(data => {
          dispatch(setRiskData({ incidents: data, loadingIncidents: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorIncidents(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        }),
  
        fetchRiskScoreHistory().then(data => {
          dispatch(setRiskData({ historicalData: data, loadingHistoricalData: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorHistoricalData(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        }),
  
        fetchEsgCategories().then(data => {
          dispatch(setRiskData({ esgCategories: data, loadingEsgCategories: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorEsgCategories(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        }),
  
        fetchSeverityLevels().then(data => {
          dispatch(setRiskData({ severityLevels: data, loadingSeverityLevels: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorSeverityLevels(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        }),
  
        fetchCriticalIncidents().then(data => {
          dispatch(setRiskData({ criticalIncidents: data, loadingCriticalIncidents: false }));
          return data;
        }).catch(err => {
          dispatch(setErrorCriticalIncidents(err instanceof Error ? err.message : 'Unknown error'));
          return null;
        })
      ];
  
      await Promise.all(requests);
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