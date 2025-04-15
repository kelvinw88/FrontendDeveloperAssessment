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
  subcategory: string;
  severity: string;
  description: string;
  detailedDescription: string;
  location: string;
  riskScoreImpact: { overall: number; environmental: number; social: number; governance: number } | number;
  sources?: Array<{ title: string; url: string; publishDate: string }>;
  summary?: string;
}

interface HistoricalData {
  date: string;
  overall: number;
  environmental: number;
  social: number;
  governance: number;
}

interface EsgCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

interface SeverityLevel {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CriticalIncident {
  id: string;
  title: string;
  date: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  riskScoreImpact: number;
  summary: string;
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
  esgCategories: EsgCategory[];
  severityLevels: SeverityLevel[];
  loadingRiskData: boolean;
  loadingIncidents: boolean;
  loadingHistoricalData: boolean;
  loadingEsgCategories: boolean;
  loadingSeverityLevels: boolean;
  errorRiskData: string | null;
  errorIncidents: string | null;
  errorHistoricalData: string | null;
  errorEsgCategories: string | null;
  errorSeverityLevels: string | null;
  criticalIncidents: CriticalIncident[];
  loadingCriticalIncidents: boolean;
  errorCriticalIncidents: string | null;
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
  esgCategories: [],
  severityLevels: [],
  loadingRiskData: false,
  loadingIncidents: false,
  loadingHistoricalData: false,
  loadingEsgCategories: false,
  loadingSeverityLevels: false,
  errorRiskData: null,
  errorIncidents: null,
  errorHistoricalData: null,
  errorEsgCategories: null,
  errorSeverityLevels: null,
  criticalIncidents: [],
  loadingCriticalIncidents: false,
  errorCriticalIncidents: null,
};


const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    setRiskData: (state, action: PayloadAction<Partial<RiskState>>) => {
      Object.assign(state, action.payload);
    },
    setLoadingRiskData: (state) => {
      state.loadingRiskData = true;
      state.errorRiskData = null;
    },
    setLoadingIncidents: (state) => {
      state.loadingIncidents = true;
      state.errorIncidents = null;
    },
    setLoadingHistoricalData: (state) => {
      state.loadingHistoricalData = true;
      state.errorHistoricalData = null;
    },
    setErrorRiskData: (state, action: PayloadAction<string>) => {
      state.loadingRiskData = false;
      state.errorRiskData = action.payload;
    },
    setErrorIncidents: (state, action: PayloadAction<string>) => {
      state.loadingIncidents = false;
      state.errorIncidents = action.payload;
    },
    setErrorHistoricalData: (state, action: PayloadAction<string>) => {
      state.loadingHistoricalData = false;
      state.errorHistoricalData = action.payload;
    },
    setLoadingEsgCategories: (state) => {
      state.loadingEsgCategories = true;
      state.errorEsgCategories = null;
    },
    setErrorEsgCategories: (state, action: PayloadAction<string>) => {
      state.loadingEsgCategories = false;
      state.errorEsgCategories = action.payload;
    },
    setLoadingSeverityLevels: (state) => {
      state.loadingSeverityLevels = true;
      state.errorSeverityLevels = null;
    },
    setErrorSeverityLevels: (state, action: PayloadAction<string>) => {
      state.loadingSeverityLevels = false;
      state.errorSeverityLevels = action.payload;
    },
    setLoadingCriticalIncidents: (state) => {
      state.loadingCriticalIncidents = true;
      state.errorCriticalIncidents = null;
    },
    setErrorCriticalIncidents: (state, action: PayloadAction<string>) => {
      state.loadingCriticalIncidents = false;
      state.errorCriticalIncidents = action.payload;
    },

  },
});

export const {
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
} = riskSlice.actions;

export default riskSlice.reducer;
export { initialState };
export type {
  RiskState,
  Incident,
  HistoricalData,
  SeverityLevel,
  EsgCategory,
  CriticalIncident
};