import React from 'react';
import { render, screen } from '@testing-library/react';
import CompanyOverview from './CompanyOverview';
import { RiskState } from '../../features/riskSlice';

describe('CompanyOverview', () => {
  const mockData: RiskState = {
    companyId: 'COMP123',
    companyName: 'Test Company',
    overallRiskScore: 65,
    trend: {
      direction: 'increasing',
      percentage: 10,
    },
    lastUpdated: '2023-06-15T10:30:00Z',
    categories: {
      environmental: {
        score: 70,
        trend: 'increasing',
        changePercentage: 15,
      },
      social: {
        score: 60,
        trend: 'decreasing',
        changePercentage: 5,
      },
      governance: {
        score: 65,
        trend: 'stable',
        changePercentage: 0,
      },
    },
    
    incidents: [],
    historicalData: [],
    esgCategories: [],
    severityLevels: [],
    criticalIncidents: [],
    loadingRiskData: false,
    loadingIncidents: false,
    loadingHistoricalData: false,
    loadingEsgCategories: false,
    loadingSeverityLevels: false,
    loadingCriticalIncidents: false,
    errorRiskData: null,
    errorIncidents: null,
    errorHistoricalData: null,
    errorEsgCategories: null,
    errorSeverityLevels: null,
    errorCriticalIncidents: null,
  };

  test('renders loading state', () => {
    render(<CompanyOverview {...mockData} loadingRiskData={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMsg = 'Test error message';
    render(<CompanyOverview {...mockData} errorRiskData={errorMsg} />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test('renders company data correctly', () => {
    render(<CompanyOverview {...mockData} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('COMP123')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText(/increasing by 10%/i)).toBeInTheDocument();
  });

  test('renders category scores correctly', () => {
    render(<CompanyOverview {...mockData} />);
    
    
    const environmentalSection = screen.getByText('Environmental').closest('div');
    expect(environmentalSection).toHaveTextContent(/Score: 70/);
    
    const socialSection = screen.getByText('Social').closest('div');
    expect(socialSection).toHaveTextContent(/Score: 60/);
    
    const governanceSection = screen.getByText('Governance').closest('div');
    expect(governanceSection).toHaveTextContent(/Score: 65/);
  });

  test('renders correct trend icons', () => {
    render(<CompanyOverview {...mockData} />);
    
    expect(screen.getAllByTestId('ArrowUpwardIcon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('ArrowDownwardIcon').length).toBeGreaterThan(0);
  });

  test('handles missing data gracefully', () => {
    render(<CompanyOverview {...mockData} companyName="" trend={{}} categories={{}} />);
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });
});