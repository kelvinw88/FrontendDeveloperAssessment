import React from 'react';
import HistoricalTrend from './HistoricalTrend';

export default {
  title: 'Components/HistoricalTrend',
  component: HistoricalTrend,
};

const mockData = [
  { date: '2023-01-01', overall: 65, environmental: 70, social: 60, governance: 65 },
  { date: '2023-02-01', overall: 68, environmental: 72, social: 62, governance: 67 },
  { date: '2023-03-01', overall: 72, environmental: 75, social: 65, governance: 70 },
];

const Template = (args) => <HistoricalTrend {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: mockData,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const Error = Template.bind({});
Error.args = {
  error: 'Failed to load data',
};