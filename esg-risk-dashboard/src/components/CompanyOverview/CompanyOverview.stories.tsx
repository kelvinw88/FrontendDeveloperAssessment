import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CompanyOverview from './CompanyOverview';

export default {
  title: 'Components/CompanyOverview',
  component: CompanyOverview,
  parameters: {
    docs: {
      description: {
        component:
          'Displays a summary of company risk data from company-risk-overview.json, including company details, overall risk score, trend, last updated, and ESG category scores.',
      },
    },
  },
} as ComponentMeta<typeof CompanyOverview>;

const Template: ComponentStory<typeof CompanyOverview> = () => <CompanyOverview />;

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.parameters = {
  docs: {
    description: {
      story:
        'Renders the company overview with mock Redux data (e.g., Acme Corporation, score: 64, categories: 72/58/63).',
    },
  },
};