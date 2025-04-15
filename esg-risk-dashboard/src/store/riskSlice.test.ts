import riskReducer, {
  initialState,
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
} from './riskSlice'; // Make sure this path is correct!
import { RiskState } from './riskSlice'; // And this one too!

describe('riskSlice Reducer', () => {
  it('should return the initial state', () => {
    expect(riskReducer(undefined, { type: '' })).toEqual(initialState);
  });


  it('should handle setRiskData', () => {
    const payload: Partial<RiskState> = { companyName: 'Test Company', overallRiskScore: 75 };
    const nextState = riskReducer(initialState, setRiskData(payload));
    expect(nextState.companyName).toEqual('Test Company');
    expect(nextState.overallRiskScore).toEqual(75);
  });

  it('should handle setLoadingRiskData', () => {
    const nextState = riskReducer(initialState, setLoadingRiskData());
    expect(nextState.loadingRiskData).toBe(true);
    expect(nextState.errorRiskData).toBeNull();
  });

  it('should handle setLoadingIncidents', () => {
    const nextState = riskReducer(initialState, setLoadingIncidents());
    expect(nextState.loadingIncidents).toBe(true);
    expect(nextState.errorIncidents).toBeNull();
  });

  it('should handle setLoadingHistoricalData', () => {
    const nextState = riskReducer(initialState, setLoadingHistoricalData());
    expect(nextState.loadingHistoricalData).toBe(true);
    expect(nextState.errorHistoricalData).toBeNull();
  });

  it('should handle setErrorRiskData', () => {
    const errorMessage = 'Failed to fetch risk data';
    const nextState = riskReducer(initialState, setErrorRiskData(errorMessage));
    expect(nextState.loadingRiskData).toBe(false);
    expect(nextState.errorRiskData).toBe(errorMessage);
  });

  it('should handle setErrorIncidents', () => {
    const errorMessage = 'Failed to fetch incidents';
    const nextState = riskReducer(initialState, setErrorIncidents(errorMessage));
    expect(nextState.loadingIncidents).toBe(false);
    expect(nextState.errorIncidents).toBe(errorMessage);
  });

  it('should handle setErrorHistoricalData', () => {
    const errorMessage = 'Failed to fetch historical data';
    const nextState = riskReducer(initialState, setErrorHistoricalData(errorMessage));
    expect(nextState.loadingHistoricalData).toBe(false);
    expect(nextState.errorHistoricalData).toBe(errorMessage);
  });

  it('should handle setLoadingEsgCategories', () => {
    const nextState = riskReducer(initialState, setLoadingEsgCategories());
    expect(nextState.loadingEsgCategories).toBe(true);
    expect(nextState.errorEsgCategories).toBeNull();
  });

  it('should handle setErrorEsgCategories', () => {
    const errorMessage = 'Failed to fetch ESG categories';
    const nextState = riskReducer(initialState, setErrorEsgCategories(errorMessage));
    expect(nextState.loadingEsgCategories).toBe(false);
    expect(nextState.errorEsgCategories).toBe(errorMessage);
  });

  it('should handle setLoadingSeverityLevels', () => {
    const nextState = riskReducer(initialState, setLoadingSeverityLevels());
    expect(nextState.loadingSeverityLevels).toBe(true);
    expect(nextState.errorSeverityLevels).toBeNull();
  });

  it('should handle setErrorSeverityLevels', () => {
    const errorMessage = 'Failed to fetch severity levels';
    const nextState = riskReducer(initialState, setErrorSeverityLevels(errorMessage));
    expect(nextState.loadingSeverityLevels).toBe(false);
    expect(nextState.errorSeverityLevels).toBe(errorMessage);
  });

  it('should handle setLoadingCriticalIncidents', () => {
    const nextState = riskReducer(initialState, setLoadingCriticalIncidents());
    expect(nextState.loadingCriticalIncidents).toBe(true);
    expect(nextState.errorCriticalIncidents).toBeNull();
  });

  it('should handle setErrorCriticalIncidents', () => {
    const errorMessage = 'Failed to fetch critical incidents';
    const nextState = riskReducer(initialState, setErrorCriticalIncidents(errorMessage));
    expect(nextState.loadingCriticalIncidents).toBe(false);
    expect(nextState.errorCriticalIncidents).toBe(errorMessage);
  });

  // You can add more tests to cover specific data updates within setRiskData
  it('should handle setRiskData with specific data', () => {
    const incidentsData = [{ id: '1', title: 'Test Incident' }] as any;
    const nextState = riskReducer(initialState, setRiskData({ incidents: incidentsData }));
    expect(nextState.incidents).toEqual(incidentsData);
  });
});