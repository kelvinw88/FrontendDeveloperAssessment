import { RiskState, Incident, HistoricalData, EsgCategory, SeverityLevel } from '../store/riskSlice';

// Utility to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility to simulate random error
const simulateError = (errorRate: number): boolean => {
  return Math.random() < errorRate;
};

// Utility to handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json(); // Try to get more specific error info
    throw new Error(errorData?.message || `Failed to fetch data (Status: ${response.status})`);
  }
  return response.json();
};

export const fetchRiskData = async (): Promise<Partial<RiskState>> => {
  await delay(3000);
  if (simulateError(0.5)) {
    throw new Error('Simulated API failure for risk data');
  }
  const response = await fetch('/company-risk-overview.json');
  return handleResponse(response);
};

export const fetchIncidents = async (): Promise<Incident[]> => {
  await delay(3000);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for incidents');
  }
  const response = await fetch('/incidents.json');
  const data = await handleResponse(response);
  return data.incidents;
};

export const fetchRiskScoreHistory = async (): Promise<HistoricalData[]> => {
  await delay(3000);
  if (simulateError(0.2)) {
    throw new Error('Simulated API failure for historical data');
  }
  const response = await fetch('/risk-score-history.json');
  const data = await handleResponse(response);
  return data.data;
};

export const fetchEsgCategories = async (): Promise<EsgCategory[]> => {
  await delay(3000);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for ESG Categories');
  }
  const response = await fetch('/esg-categories.json');
  const data = await handleResponse(response);
  return data.categories;
};

export const fetchSeverityLevels = async (): Promise<SeverityLevel[]> => {
  await delay(3000);
  if (simulateError(0)) {
    throw new Error('Simulated API failure for severity levels');
  }
  const response = await fetch('/severity-levels.json');
  const data = await handleResponse(response);
  return data.severityLevels;
};

export const fetchCriticalIncidents = async (): Promise<SeverityLevel[]> => {
  await delay(300);
  if (simulateError(0.5)) {
    throw new Error('Simulated API failure for critical incidents');
  }
  const response = await fetch('/critical-incidents.json');
  const data = await handleResponse(response);
  return data.criticalIncidents;
};