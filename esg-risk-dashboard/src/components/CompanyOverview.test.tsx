import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import CompanyOverview from './CompanyOverview';

test('renders CompanyOverview with Redux data', () => {
  render(
    <Provider store={store}>
      <CompanyOverview />
    </Provider>
  );
  expect(screen.getByText(/Company Risk Overview/i)).toBeInTheDocument();
  expect(screen.getByText(/Company Name/i)).toBeInTheDocument();
  expect(screen.getByText(/Company ID/i)).toBeInTheDocument();
  expect(screen.getByText(/Overall Risk Score/i)).toBeInTheDocument();
  expect(screen.getByText(/Trend/i)).toBeInTheDocument();
  expect(screen.getByText(/Last Updated/i)).toBeInTheDocument();
  expect(screen.getByText(/Environmental/i)).toBeInTheDocument();
});

test('handles missing data gracefully', () => {
  render(
    <Provider store={store}>
      <CompanyOverview />
    </Provider>
  );
  expect(screen.getByText(/N\/A/i)).toBeInTheDocument(); // Checks for fallback text
});