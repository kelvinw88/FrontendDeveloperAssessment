import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { setRiskData } from '../src/store/riskSlice';

store.dispatch(setRiskData({
  companyId: 'acme-001',
  companyName: 'Acme Corporation',
  overallRiskScore: 64,
  trend: { direction: 'increasing', percentage: 8.2 },
  lastUpdated: '2024-10-25',
  categories: {
    environmental: { score: 72, trend: 'decreasing', changePercentage: 5.1 },
    social: { score: 58, trend: 'increasing', changePercentage: 3.7 },
    governance: { score: 63, trend: 'stable', changePercentage: 0.2 },
  },
  incidents: [
    {
      id: 'inc-001',
      title: 'Regulatory Fine Issued',
      date: '2024-10-15',
      category: 'governance',
      severity: 'critical',
      description: 'Fine due to non-compliance with regulations.',
      riskScoreImpact: { overall: 4, environmental: 0, social: 0, governance: 4 },
    },
  ],
}));

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};