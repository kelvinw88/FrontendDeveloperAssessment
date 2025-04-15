import React from 'react';
import CompanyOverview from './CompanyOverview';
import { RiskState } from '../../features/riskSlice';

export default {
  title: 'Components/CompanyOverview',
  component: CompanyOverview,
};

const Template = (args: RiskState) => <CompanyOverview {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  loadingRiskData: true,
};

export const Error = Template.bind({});
Error.args = {
  errorRiskData: 'Failed to load risk data',
};

export const Default = Template.bind({});
Default.args = {
  companyId: 'COMP123',
  companyName: 'Acme Corporation',
  overallRiskScore: 75,
  trend: {
    direction: 'increasing',
    percentage: 12,
  },
  lastUpdated: '2023-06-15T10:30:00Z',
  categories: {
    environmental: {
      score: 80,
      trend: 'increasing',
      changePercentage: 15,
    },
    social: {
      score: 65,
      trend: 'decreasing',
      changePercentage: 5,
    },
    governance: {
      score: 70,
      trend: 'stable',
      changePercentage: 0,
    },
  },
};

export const MissingData = Template.bind({});
MissingData.args = {
  companyName: 'Incomplete Inc.',
  overallRiskScore: 0,
  trend: {},
  categories: {},
};