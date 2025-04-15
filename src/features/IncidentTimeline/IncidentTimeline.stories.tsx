import React from 'react';
import { Story, Meta } from '@storybook/react';
import IncidentTimeline, { IncidentTimelineProps } from './IncidentTimeline'; 
import { Incident, EsgCategory, SeverityLevel } from '../../store/riskSlice'; 
import { format, subDays } from 'date-fns';

export default {
  title: 'Components/IncidentTimeline',
  component: IncidentTimeline,
} as Meta;

const now = new Date();

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Environmental Spill near River',
    date: format(subDays(now, 10), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'environmental',
    subcategory: 'spill',
    severity: 'high',
    description: 'A significant chemical spill occurred near the main river.',
    detailedDescription: 'Detailed report on the chemical spill...',
    location: 'River Site A',
    riskScoreImpact: { overall: 8.5, environmental: 9.0, social: 7.0, governance: 8.0 },
    sources: [],
  },
  {
    id: 'INC-002',
    title: 'Labor Strike at Manufacturing Plant',
    date: format(subDays(now, 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'social',
    subcategory: 'labor',
    severity: 'critical',
    description: 'A major labor strike has halted production at the main plant.',
    detailedDescription: 'Details about the labor negotiations and impact...',
    location: 'Manufacturing Plant B',
    riskScoreImpact: { overall: 9.2, environmental: 6.0, social: 9.5, governance: 8.0 },
    sources: [],
  },
  {
    id: 'INC-003',
    title: 'Data Security Breach',
    date: format(subDays(now, 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'governance',
    subcategory: 'cybersecurity',
    severity: 'medium',
    description: 'Unauthorized access to customer data detected.',
    detailedDescription: 'Forensic report on the data breach...',
    location: 'Corporate Headquarters',
    riskScoreImpact: { overall: 7.8, environmental: 5.0, social: 7.5, governance: 8.5 },
    sources: [],
  },
  {
    id: 'INC-004',
    title: 'Community Protest Against New Project',
    date: format(subDays(now, 15), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'social',
    subcategory: 'community',
    severity: 'low',
    description: 'Local community members are protesting against the new development project.',
    detailedDescription: 'Details of the community concerns and company response...',
    location: 'Project Site C',
    riskScoreImpact: { overall: 4.5, environmental: 5.5, social: 6.0, governance: 2.0 },
    sources: [],
  },
  {
    id: 'INC-005',
    title: 'Regulatory Fine for Emissions',
    date: format(subDays(now, 7), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    category: 'environmental',
    subcategory: 'regulatory',
    severity: 'high',
    description: 'The company has been fined for exceeding emission limits.',
    detailedDescription: 'Details of the regulatory violation and penalty...',
    location: 'Plant D',
    riskScoreImpact: { overall: 8.0, environmental: 8.8, social: 4.0, governance: 7.2 },
    sources: [],
  },
];

const mockEsgCategories: EsgCategory[] = [
  { id: 'environmental', name: 'Environmental', subcategories: [{ id: 'spill', name: 'Spill' }, { id: 'regulatory', name: 'Regulatory' }] },
  { id: 'social', name: 'Social', subcategories: [{ id: 'labor', name: 'Labor' }, { id: 'community', name: 'Community' }] },
  { id: 'governance', name: 'Governance', subcategories: [{ id: 'cybersecurity', name: 'Cybersecurity' }] },
];

const mockSeverityLevels: SeverityLevel[] = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'critical', name: 'Critical' },
];

const Template: Story<IncidentTimelineProps> = (args) => <IncidentTimeline {...args} />;

export const Default = Template.bind({});
Default.args = {
  incidents: mockIncidents,
  loadingIncidents: false,
  errorIncidents: null,
  esgCategories: mockEsgCategories,
  severityLevels: mockSeverityLevels,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  loadingIncidents: true,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  loadingIncidents: false,
  errorIncidents: 'Failed to load incident data.',
};

export const NoIncidents = Template.bind({});
NoIncidents.args = {
  ...Default.args,
  incidents: [],
};

export const NoCategories = Template.bind({});
NoCategories.args = {
  ...Default.args,
  esgCategories: [],
};

export const NoSeverityLevels = Template.bind({});
NoSeverityLevels.args = {
  ...Default.args,
  severityLevels: [],
};