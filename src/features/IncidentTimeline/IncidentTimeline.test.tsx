import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IncidentTimeline from '../IncidentTimeline/IncidentTimeline'; // Adjust the path as needed
import { Incident, EsgCategory, SeverityLevel } from '../../store/riskSlice'; // Adjust the path as needed
import { format, subDays } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const now = new Date();

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Environmental Spill',
    date: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'environmental',
    severity: 'high',
    riskScoreImpact: { overall: 8.5, environmental: 9.0, social: 7.0, governance: 8.0 },
    description: 'A spill occurred.',
    location: 'Site A',
  },
];

const mockEsgCategories: EsgCategory[] = [
  { id: 'environmental', name: 'Environmental', subcategories: [] },
];

const mockSeverityLevels: SeverityLevel[] = [
  { id: 'high', name: 'High' },
];

describe('<IncidentTimeline />', () => {
  it('renders loading state', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <IncidentTimeline
          incidents={[]}
          loadingIncidents={true}
          errorIncidents={null}
          esgCategories={[]}
          severityLevels={[]}
        />
      </LocalizationProvider>
    );
    expect(screen.getByText('Incident Timeline')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <IncidentTimeline
          incidents={[]}
          loadingIncidents={false}
          errorIncidents="Failed to load incident data."
          esgCategories={[]}
          severityLevels={[]}
        />
      </LocalizationProvider>
    );
    expect(screen.getByText('Incident Timeline')).toBeInTheDocument();
    expect(screen.getByText('Failed to load incident data.')).toBeInTheDocument();
  });

  it('renders "No incidents match the current filters" message when no incidents are provided', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <IncidentTimeline
          incidents={[]}
          loadingIncidents={false}
          errorIncidents={null}
          esgCategories={[]}
          severityLevels={[]}
        />
      </LocalizationProvider>
    );
    expect(screen.getByText('Incident Timeline')).toBeInTheDocument();
    expect(screen.getByText('No incidents match the current filters.')).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <IncidentTimeline
          incidents={mockIncidents}
          loadingIncidents={false}
          errorIncidents={null}
          esgCategories={mockEsgCategories}
          severityLevels={mockSeverityLevels}
        />
      </LocalizationProvider>
    );
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Severity')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });
});