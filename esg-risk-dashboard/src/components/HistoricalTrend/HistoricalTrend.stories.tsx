import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import HistoricalTrend from './HistoricalTrend';
import { setRiskData } from '../features/riskSlice';

export default {
  title: 'Components/HistoricalTrend',
  component: HistoricalTrend,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Renders a D3 multi-line chart showing historical overall, environmental, social, and governance risk scores over time, with a legend, using Redux data.',
      },
    },
  },
} as ComponentMeta<typeof HistoricalTrend>;

const mockData = [
  {
    date: '2024-05-01',
    overall: 60,
    environmental: 70,
    social: 55,
    governance: 62,
  },
  {
    date: '2024-06-01',
    overall: 62,
    environmental: 71,
    social: 56,
    governance: 63,
  },
  {
    date: '2024-07-01',
    overall: 64,
    environmental: 72,
    social: 58,
    governance: 63,
  },
  {
    date: '2024-08-01',
    overall: 63,
    environmental: 71,
    social: 57,
    governance: 64,
  },
  {
    date: '2024-09-01',
    overall: 65,
    environmental: 73,
    social: 59,
    governance: 65,
  },
  {
    date: '2024-10-01',
    overall: 64,
    environmental: 72,
    social: 58,
    governance: 64,
  },
];

export const Default = () => {
  store.dispatch(setRiskData({ historicalData: mockData, loadingHistoricalData: false }));
  return <HistoricalTrend />;
};
Default.storyName = 'Default';
Default.parameters = {
  docs: {
    description: {
      story:
        'Displays a multi-line chart with historical scores for overall, environmental, social, and governance metrics, including a legend, using mock Redux data.',
    },
  },
};

export const Loading = () => {
  store.dispatch(setRiskData({ loadingHistoricalData: true }));
  return <HistoricalTrend />;
};
Loading.storyName = 'Loading';
Loading.parameters = {
  docs: {
    description: {
      story: 'Shows the loading state while historical data is being fetched.',
    },
  },
};

export const Error = () => {
  store.dispatch(
    setRiskData({
      errorHistoricalData: 'Failed to load historical data',
      loadingHistoricalData: false,
    })
  );
  return <HistoricalTrend />;
};
Error.storyName = 'Error';
Error.parameters = {
  docs: {
    description: {
      story: 'Shows the error state when historical data fails to load.',
    },
  },
};

export const NoData = () => {
  store.dispatch(setRiskData({ historicalData: [], loadingHistoricalData: false }));
  return <HistoricalTrend />;
};
NoData.storyName = 'No Data';
NoData.parameters = {
  docs: {
    description: {
      story: 'Shows the no-data state when historical data is unavailable.',
    },
  },
};