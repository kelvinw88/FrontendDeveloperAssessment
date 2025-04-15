import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import HistoricalTrend from './HistoricalTrend';
import { setRiskData } from '../features/riskSlice';

test('renders HistoricalTrend with Redux data', () => {
  store.dispatch(
    setRiskData({
      historicalData: [
        {
          date: '2024-05-01',
          overall: 60,
          environmental: 70,
          social: 55,
          governance: 62,
        },
        {
          date: '2024-06-01',
          overall: 62,
          environmental: 71,
          social: 56,
          governance: 63,
        },
      ],
      loadingHistoricalData: false,
    })
  );
  render(
    <Provider store={store}>
      <HistoricalTrend />
    </Provider>
  );
  expect(screen.getByText(/Historical Risk Trend/i)).toBeInTheDocument();
  expect(screen.getByRole('region', { name: /Historical Risk Trend/i })).toContainElement(
    screen.getByRole('img', { name: /overall trend line/i })
  );
});

test('renders loading state', () => {
  store.dispatch(setRiskData({ loadingHistoricalData: true }));
  render(
    <Provider store={store}>
      <HistoricalTrend />
    </Provider>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('renders error state', () => {
  store.dispatch(
    setRiskData({
      errorHistoricalData: 'Test error',
      loadingHistoricalData: false,
    })
  );
  render(
    <Provider store={store}>
      <HistoricalTrend />
    </Provider>
  );
  expect(screen.getByText(/Test error/i)).toBeInTheDocument();
});

test('renders no data state', () => {
  store.dispatch(setRiskData({ historicalData: [], loadingHistoricalData: false }));
  render(
    <Provider store={store}>
      <HistoricalTrend />
    </Provider>
  );
  expect(screen.getByText(/No historical data available/i)).toBeInTheDocument();
});