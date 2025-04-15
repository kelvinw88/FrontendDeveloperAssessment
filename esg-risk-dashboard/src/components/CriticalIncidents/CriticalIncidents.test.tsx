import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CriticalIncidents from '../CriticalIncidents/CriticalIncidents'; 
import { CriticalIncident, Incident } from '../../features/riskSlice'; 
import { format, subDays } from 'date-fns';

const now = new Date();

const mockCriticalIncidents: CriticalIncident[] = [
  {
    id: '1',
    title: 'Network Outage',
    severity: 'critical',
    riskScoreImpact: 9.2,
    date: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Major network outage affecting all services.',
    category: 'IT',
    location: 'Data Center A',
  },
];

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Network Outage',
    severity: 'critical',
    riskScoreImpact: 9.2,
    date: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Major network outage affecting all services.',
    category: 'IT',
    location: 'Data Center A',
    details: 'Detailed information about the network outage...',
  },
];

describe('<CriticalIncidents />', () => {
  it('renders loading state', () => {
    render(
      <CriticalIncidents
        criticalIncidents={[]}
        loadingCriticalIncidents={true}
        errorCriticalIncidents={null}
        incidents={[]}
      />
    );
    expect(screen.getByText('Loading Critical Incidents...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <CriticalIncidents
        criticalIncidents={[]}
        loadingCriticalIncidents={false}
        errorCriticalIncidents="Failed to fetch critical incidents."
        incidents={[]}
      />
    );
    expect(screen.getByText('Failed to load critical incidents: Failed to fetch critical incidents.')).toBeInTheDocument();
  });

  it('renders "No critical incidents" message when there are no highlighted incidents', () => {
    render(
      <CriticalIncidents
        criticalIncidents={[]}
        loadingCriticalIncidents={false}
        errorCriticalIncidents={null}
        incidents={[]}
      />
    );
    expect(screen.getByText(/no critical incidents meeting the highlighting criteria/i)).toBeInTheDocument();
  });

  it('renders highlighted critical incidents', () => {
    render(
      <CriticalIncidents
        criticalIncidents={mockCriticalIncidents}
        loadingCriticalIncidents={false}
        errorCriticalIncidents={null}
        incidents={mockIncidents}
      />
    );
    expect(screen.getByText('Network Outage')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('Impact: 9.2')).toBeInTheDocument();
  });

  it('renders the "View Details" button for each incident', () => {
    render(
      <CriticalIncidents
        criticalIncidents={mockCriticalIncidents}
        loadingCriticalIncidents={false}
        errorCriticalIncidents={null}
        incidents={mockIncidents}
      />
    );
    expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
  });

});