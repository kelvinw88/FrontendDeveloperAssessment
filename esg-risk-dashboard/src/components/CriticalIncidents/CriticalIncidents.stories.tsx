import React from 'react';
import { Story, Meta } from '@storybook/react';
import CriticalIncidents, { CriticalIncidentsProps } from './CriticalIncidents'; 
import { CriticalIncident, Incident } from '../../features/riskSlice';
import { format, subDays, parseISO } from 'date-fns';

export default {
  title: 'Components/CriticalIncidents',
  component: CriticalIncidents,
} as Meta;

const now = new Date();
const thirtyDaysAgo = subDays(now, 30);

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
  {
    id: '2',
    title: 'Security Breach Attempt',
    severity: 'high',
    riskScoreImpact: 8.5,
    date: format(subDays(now, 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Detected multiple unauthorized access attempts.',
    category: 'Security',
    location: 'Global',
  },
  {
    id: '3',
    title: 'Minor Service Disruption',
    severity: 'medium',
    riskScoreImpact: 6.5,
    date: format(thirtyDaysAgo, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Intermittent issues with one of the minor services.',
    category: 'Application',
    location: 'Region B',
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
  {
    id: '2',
    title: 'Security Breach Attempt',
    severity: 'high',
    riskScoreImpact: 8.5,
    date: format(subDays(now, 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Detected multiple unauthorized access attempts.',
    category: 'Security',
    location: 'Global',
    details: 'More details about the security breach attempt...',
  },
  {
    id: '3',
    title: 'Minor Service Disruption',
    severity: 'medium',
    riskScoreImpact: 6.5,
    date: format(thirtyDaysAgo, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    summary: 'Intermittent issues with one of the minor services.',
    category: 'Application',
    location: 'Region B',
    details: 'Further details on the minor service disruption...',
  },
];

const Template: Story<CriticalIncidentsProps> = (args) => <CriticalIncidents {...args} />;

export const Default = Template.bind({});
Default.args = {
  criticalIncidents: mockCriticalIncidents,
  loadingCriticalIncidents: false,
  errorCriticalIncidents: null,
  incidents: mockIncidents,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  loadingCriticalIncidents: true,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  loadingCriticalIncidents: false,
  errorCriticalIncidents: 'Failed to fetch critical incidents.',
};

export const NoIncidents = Template.bind({});
NoIncidents.args = {
  ...Default.args,
  criticalIncidents: [],
};