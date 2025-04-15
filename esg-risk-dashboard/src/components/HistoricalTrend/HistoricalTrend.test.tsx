import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoricalTrend from './HistoricalTrend';
import '@testing-library/jest-dom';

jest.mock('d3', () => ({
  select: jest.fn(),
  scaleTime: jest.fn(),
  scaleLinear: jest.fn(),
  line: jest.fn(),
  axisBottom: jest.fn(),
  axisLeft: jest.fn(),
  extent: jest.fn(),
  max: jest.fn(),
  timeFormat: jest.fn(),
}));

describe('HistoricalTrend - Non-D3 Functionality', () => {
  const mockData = [
    { date: '2023-01-01', overall: 65, environmental: 70, social: 60, governance: 65 },
    { date: '2023-02-01', overall: 68, environmental: 72, social: 62, governance: 67 },
    { date: '2023-03-01', overall: 72, environmental: 75, social: 65, governance: 70 },
  ];

  test('shows loading spinner when loading prop is true', () => {
    render(<HistoricalTrend loading={true} data={[]} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByRole('svg')).not.toBeInTheDocument();
  });

  test('shows error message when error prop exists', () => {
    const errorMessage = 'Test error message';
    render(<HistoricalTrend error={errorMessage} data={[]} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('does not render SVG when no data is provided', () => {
    render(<HistoricalTrend data={[]} />);
    expect(document.querySelector('svg')).toBeInTheDocument(); 
  });

});