import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import IncidentTimeline from './IncidentTimeline';
import { setRiskData } from '../../features/riskSlice';

const mockIncidents = [
  {
    id: 'incident-456',
    title: 'Emissions Reporting Violation',
    date: '2023-10-15T14:30:00Z',
    category: 'environmental',
    subcategory: 'climate_change',
    severity: 'high',
    description: 'Company fined $1.5M for misreporting carbon emissions',
    detailedDescription:
      'Regulatory authorities have imposed a $1.5M fine on Acme Corporation for systematically underreporting emissions data.',
    location: 'Frankfurt, Germany',
    riskScoreImpact: {
      overall: 8.2,
      environmental: 16.5,
      social: 0,
      governance: 0.8,
    },
    sources: [
      {
        title: 'European Regulatory Authority Report',
        url: 'https://example.com/regulatory/report-2023-112',
        publishDate: '2023-10-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'incident-457',
    title: 'Workplace Safety Incident',
    date: '2023-10-15T09:15:00Z',
    category: 'social',
    subcategory: 'labor_practices',
    severity: 'medium',
    description: 'Three workers injured in manufacturing plant accident',
    detailedDescription:
      'An equipment malfunction at Acme’s Munich manufacturing plant resulted in injuries to three workers.',
    location: 'Munich, Germany',
    riskScoreImpact: {
      overall: 4.5,
      environmental: 0,
      social: 9.3,
      governance: 3.7,
    },
    sources: [
      {
        title: 'Local News Report',
        url: 'https://example.com/news/workplace-accident',
        publishDate: '2023-09-22T12:45:00Z',
      },
    ],
  },
];

test('renders IncidentTimeline with incidents', () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  expect(screen.getByText(/Incident Timeline/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
});

test('filters incidents by category', () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  const select = screen.getByLabelText(/Category/i);
  fireEvent.mouseDown(select);
  const envOption = screen.getByRole('option', { name: 'Environmental' });
  fireEvent.click(envOption);
  expect(select).toHaveValue('environmental');
});

test('filters incidents by title', () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  const titleInput = screen.getByLabelText(/Title/i);
  fireEvent.change(titleInput, { target: { value: 'Emissions' } });
  expect(titleInput).toHaveValue('Emissions');
});

test('filters incidents by date range', () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  const startDateInput = screen.getByLabelText(/Start Date/i);
  fireEvent.change(startDateInput, { target: { value: '2023-10-15' } });
  expect(startDateInput).toHaveValue('2023-10-15');
});

test('shows detail view on click', () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  const dots = document.querySelectorAll('circle');
  if (dots.length) {
    fireEvent.click(dots[0]);
    expect(screen.getByText(/Incident Details/i)).toBeInTheDocument();
    expect(screen.getByText('incident-456')).toBeInTheDocument();
    expect(screen.getByText('Emissions Reporting Violation')).toBeInTheDocument();
    expect(screen.getByText('environmental')).toBeInTheDocument();
    expect(screen.getByText('climate_change')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(
      screen.getByText(/Company fined \$1\.5M for misreporting carbon emissions/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Regulatory authorities have imposed a \$1\.5M fine on Acme Corporation/
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Frankfurt, Germany')).toBeInTheDocument();
    expect(screen.getByText('Overall: 8.2')).toBeInTheDocument();
    expect(screen.getByText('European Regulatory Authority Report')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/regulatory/report-2023-112')).toBeInTheDocument();
  } else {
    throw new Error('No data points rendered');
  }
});

test('renders loading state', () => {
  store.dispatch(setRiskData({ loadingIncidents: true }));
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('renders error state', () => {
  store.dispatch(
    setRiskData({ errorIncidents: 'Test error', loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  expect(screen.getByText(/Test error/i)).toBeInTheDocument();
});

test('renders no data state', () => {
  store.dispatch(
    setRiskData({ incidents: [], loadingIncidents: false })
  );
  render(
    <Provider store={store}>
      <IncidentTimeline />
    </Provider>
  );
  expect(screen.getByText(/No incidents match the filters/i)).toBeInTheDocument();
});