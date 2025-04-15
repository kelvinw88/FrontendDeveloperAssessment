import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import IncidentTimeline from './IncidentTimeline';

export default {
  title: 'Components/IncidentTimeline',
  component: IncidentTimeline,
  parameters: {
    docs: {
      description: {
        component: 'Lists ESG incidents with filters for date range, category, and severity. Data is fetched from Redux state.',
      },
    },
  },
} as ComponentMeta<typeof IncidentTimeline>;

const Template: ComponentStory<typeof IncidentTimeline> = () => <IncidentTimeline />;

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.parameters = {
  docs: {
    description: {
      story: 'Renders the incident timeline with mock incidents from Redux. Supports filtering by date, category, and severity.',
    },
  },
};