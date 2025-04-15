import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import IncidentTimeline from './IncidentTimeline';
import { setRiskData } from '../../features/riskSlice';

export default {
  title: 'Components/IncidentTimeline',
  component: IncidentTimeline,
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
          'Renders a D3 line chart plotting all incidents by time, with a severity legend, filters for time, category, and title, and a detail view showing all metadata.',
      },
    },
  },
} as ComponentMeta<typeof IncidentTimeline>;

const mockIncidents = [
  {
    id: 'incident-456',
    title: 'Emissions Reporting Violation',
    date: '2023-10-15T14:30:00Z',
    category: 'environmental',
    subcategory: 'climate_change',
    severity: 'high',
    description: 'Company fined $1.5M for misreporting carbon emissions',
    detailedDescription:
      'Regulatory authorities have imposed a $1.5M fine on Acme Corporation for systematically underreporting emissions data.',
    location: 'Frankfurt, Germany',
    riskScoreImpact: {
      overall: 8.2,
      environmental: 16.5,
      social: 0,
      governance: 0.8,
    },
    sources: [
      {
        title: 'European Regulatory Authority Report',
        url: 'https://example.com/regulatory/report-2023-112',
        publishDate: '2023-10-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'incident-457',
    title: 'Workplace Safety Incident',
    date: '2023-10-15T09:15:00Z',
    category: 'social',
    subcategory: 'labor_practices',
    severity: 'medium',
    description: 'Three workers injured in manufacturing plant accident',
    detailedDescription:
      'An equipment malfunction at Acme’s Munich manufacturing plant resulted in injuries to three workers.',
    location: 'Munich, Germany',
    riskScoreImpact: {
      overall: 4.5,
      environmental: 0,
      social: 9.3,
      governance: 3.7,
    },
    sources: [
      {
        title: 'Local News Report',
        url: 'https://example.com/news/workplace-accident',
        publishDate: '2023-09-22T12:45:00Z',
      },
    ],
  },
  {
    id: 'incident-458',
    title: 'Executive Resignation',
    date: '2023-10-18T16:45:00Z',
    category: 'governance',
    subcategory: 'board_structure',
    severity: 'medium',
    description: 'CFO resigns following emissions reporting scandal',
    detailedDescription:
      'Acme’s Chief Financial Officer has resigned with immediate effect following the emissions reporting violation.',
    location: 'Company Headquarters',
    riskScoreImpact: {
      overall: 3.8,
      environmental: 0,
      social: 0,
      governance: 11.5,
    },
    sources: [
      {
        title: 'Company Announcement',
        url: 'https://acme-corp.example.com/press/cfo-departure',
        publishDate: '2023-10-18T16:30:00Z',
      },
    ],
  },
  {
    id: 'incident-460',
    title: 'Data Privacy Breach',
    date: '2023-11-02T08:15:00Z',
    category: 'governance',
    subcategory: 'business_ethics',
    severity: 'critical',
    description: 'Customer data breach affecting 100,000+ users',
    detailedDescription:
      'A significant security breach was discovered in Acme’s customer database, potentially exposing personal information of over 100,000 users.',
    location: 'Global',
    riskScoreImpact: {
      overall: 12.7,
      environmental: 0,
      social: 8.3,
      governance: 17.5,
    },
    sources: [
      {
        title: 'Company Security Notice',
        url: 'https://acme-corp.example.com/security/data-incident',
        publishDate: '2023-11-02T12:00:00Z',
      },
    ],
  },
];

export const Default = () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  return <IncidentTimeline />;
};
Default.storyName = 'Default';
Default.parameters = {
  docs: {
    description: {
      story:
        'Displays a line chart of all incidents with severity legend, filters for time, category, and title, and clickable detail view with full metadata.',
    },
  },
};

export const Loading = () => {
  store.dispatch(setRiskData({ loadingIncidents: true }));
  return <IncidentTimeline />;
};
Loading.storyName = 'Loading';
Loading.parameters = {
  docs: {
    description: {
      story: 'Shows the loading state while incidents are being fetched.',
    },
  },
};

export const Error = () => {
  store.dispatch(
    setRiskData({
      errorIncidents: 'Failed to load incidents',
      loadingIncidents: false,
    })
  );
  return <IncidentTimeline />;
};
Error.storyName = 'Error';
Error.parameters = {
  docs: {
    description: {
      story: 'Shows the error state when incidents fail to load.',
    },
  },
};

export const NoData = () => {
  store.dispatch(
    setRiskData({ incidents: [], loadingIncidents: false })
  );
  return <IncidentTimeline />;
};
NoData.storyName = 'No Data';
NoData.parameters = {
  docs: {
    description: {
      story: 'Shows the no-data state when no incidents are available.',
    },
  },
};

export const Filtered = () => {
  store.dispatch(
    setRiskData({ incidents: mockIncidents, loadingIncidents: false })
  );
  return <IncidentTimeline />;
};
Filtered.storyName = 'Filtered';
Filtered.parameters = {
  docs: {
    description: {
      story:
        'Shows the chart with filters applied (manually test filters in Storybook controls).',
    },
  },
};