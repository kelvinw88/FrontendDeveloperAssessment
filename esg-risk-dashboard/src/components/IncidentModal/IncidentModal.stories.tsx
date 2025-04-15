import React from 'react';
import { Story, Meta } from '@storybook/react';
import IncidentModal, { IncidentModalProps } from './IncidentModal';
import { Incident, RiskScoreImpact } from '../../features/riskSlice';
import { format, subDays } from 'date-fns';

export default {
  title: 'Components/IncidentModal',
  component: IncidentModal,
} as Meta;

const now = new Date();

const mockRiskScoreImpact: RiskScoreImpact = {
  overall: 7.5,
  environmental: 8.0,
  social: 6.5,
  governance: 7.0,
};

const mockIncident: Incident = {
  id: 'INC-2025-001',
  title: 'Sample Incident Title',
  date: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
  category: 'Operational Disruption',
  subcategory: 'System Failure',
  severity: 'high',
  description: 'A brief description of the incident.',
  detailedDescription: 'This is a more detailed explanation of what happened during the incident, including root causes and impact.',
  location: 'Main Server Room',
  riskScoreImpact: mockRiskScoreImpact,
  sources: [
    {
      title: 'Internal Report',
      url: 'https://internal.example.com/reports/123',
      publishDate: format(subDays(now, 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    },
    {
      title: 'External News Article',
      url: 'https://external.example.com/news/456',
      publishDate: format(subDays(now, 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
    },
  ],
};

const Template: Story<IncidentModalProps> = (args) => <IncidentModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  open: true,
  incident: mockIncident,
  onClose: () => console.log('Close button clicked'), 
};

export const NoSubcategory = Template.bind({});
NoSubcategory.args = {
  ...Default.args,
  incident: { ...mockIncident, subcategory: undefined },
};

export const NoDetailedDescription = Template.bind({});
NoDetailedDescription.args = {
  ...Default.args,
  incident: { ...mockIncident, detailedDescription: undefined },
};

export const NoSources = Template.bind({});
NoSources.args = {
  ...Default.args,
  incident: { ...mockIncident, sources: undefined },
};

export const NoRiskScoreBreakdown = Template.bind({});
NoRiskScoreBreakdown.args = {
  ...Default.args,
  incident: { ...mockIncident, riskScoreImpact: { overall: 6.0 } as RiskScoreImpact },
};