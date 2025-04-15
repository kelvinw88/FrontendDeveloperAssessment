import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
  score: number;
  trend: string;
  changePercentage: number;
}

interface Incident {
  id: string;
  title: string;
  date: string;
  category: string;
  severity: string;
  description: string;
  riskScoreImpact: { overall: number; environmental: number; social: number; governance: number };
}

interface HistoricalData {
  date: string;
  overall: number;
  environmental: number;
  social: number;
  governance: number;
}

interface RiskState {
  companyId: string;
  companyName: string;
  overallRiskScore: number;
  trend: { direction: string; percentage: number };
  lastUpdated: string;
  categories: {
    environmental: Category;
    social: Category;
    governance: Category;
  };
  incidents: Incident[];
  historicalData: HistoricalData[];
  loading: boolean;
  error: string | null;
}

const initialState: RiskState = {
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
  historicalData: [],
  loading: false,
  error: null,
};

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    setRiskData: (state, action: PayloadAction<Partial<RiskState>>) => {
      Object.assign(state, action.payload);
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setRiskData, setLoading, setError } = riskSlice.actions;
export default riskSlice.reducer;
export type { RiskState, Incident, HistoricalData };