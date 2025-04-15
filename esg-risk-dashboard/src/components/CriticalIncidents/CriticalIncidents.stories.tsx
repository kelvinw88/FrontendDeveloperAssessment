import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CriticalIncidents from './CriticalIncidents';

export default {
  title: 'Components/CriticalIncidents',
  component: CriticalIncidents,
  parameters: {
    docs: {
      description: {
        component: 'Highlights critical and high-severity incidents from the last 30 days, using Redux state.',
      },
    },
  },
} as ComponentMeta<typeof CriticalIncidents>;

const Template: ComponentStory<typeof CriticalIncidents> = () => <CriticalIncidents />;

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.parameters = {
  docs: {
    description: {
      story: 'Shows critical incidents (e.g., Regulatory Fine) from the mock Redux data.',
    },
  },
};

export const NoIncidents = Template.bind({});
NoIncidents.storyName = 'No Incidents';
NoIncidents.parameters = {
  docs: {
    description: {
      story: 'Renders a message when no critical incidents are found in the last 30 days.',
    },
  },
  // Override Redux state for this story
  redux: {
    initialState: {
      risk: {
        incidents: [], // Empty incidents to simulate no critical incidents
      },
    },
  },
};