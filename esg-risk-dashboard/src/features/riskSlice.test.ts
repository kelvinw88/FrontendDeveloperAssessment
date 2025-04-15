import riskReducer, { setRiskData, setLoading, setError } from './riskSlice';

describe('riskSlice', () => {
  const initialState = {
    companyId: '',
    companyName: '',
    overallRiskScore: 0,
    trend: { direction: '', percentage: 0 },
    lastUpdated: '',
    categories: {
      environmental: { score: 0, trend: '', changePercentage: 0 },
      social: { score: 0, trend: '', changePercentage: 0 },
      governance: { score: 0, trend: '', changePercentage: 0 },
    },
    incidents: [],
    loading: false,
    error: null,
  };

  it('should handle setRiskData', () => {
    const action = setRiskData({ overallRiskScore: 64, trend: { direction: 'increasing', percentage: 8.2 } });
    const state = riskReducer(initialState, action);
    expect(state.overallRiskScore).toBe(64);
    expect(state.trend.direction).toBe('increasing');
  });

  it('should handle setLoading', () => {
    const state = riskReducer(initialState, setLoading());
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle setError', () => {
    const state = riskReducer(initialState, setError('Fetch failed'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Fetch failed');
  });
});