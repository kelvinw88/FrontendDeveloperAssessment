import { RiskState, Incident, HistoricalData, EsgCategory, SeverityLevel } from '../features/riskSlice';

// Utility to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility to simulate random error
const simulateError = (errorRate: number): boolean => {
  return Math.random() < errorRate;
};

export const fetchRiskData = async (): Promise<Partial<RiskState>> => {
  await delay(300);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for risk data');
  }
  const response = await fetch('/company-risk-overview.json');
  if (!response.ok) throw new Error('Failed to fetch risk data');
  return await response.json();

};

export const fetchIncidents = async (): Promise<Incident[]> => {
  await delay(1000);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for incidents');
  }
  const response = await fetch('/incidents.json');
  if (!response.ok) throw new Error('Failed to fetch incidents');
  const data = await response.json();
  return data.incidents; 
};

export const fetchRiskScoreHistory = async (): Promise<HistoricalData[]> => {
  await delay(300);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for historical data');
  }
  const response = await fetch('/risk-score-history.json');
  if (!response.ok) throw new Error('Failed to fetch historical data');
  const data = await response.json();
  return data.data;
};

export const fetchEsgCategories = async (): Promise<EsgCategory[]> => {
  await delay(300);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for ESG Categories');
  }
  const response = await fetch('/esg-categories.json');
  if (!response.ok) throw new Error('Failed to fetch ESG Categories');
  const data = await response.json();
  return data.categories;
};

export const fetchSeverityLevels = async (): Promise<SeverityLevel[]> => {
  await delay(300);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for severity levels');
  }
  const response = await fetch('/severity-levels.json');
  if (!response.ok) throw new Error('Failed to fetch severity levels');
  const data = await response.json();
  return data.severityLevels;
};