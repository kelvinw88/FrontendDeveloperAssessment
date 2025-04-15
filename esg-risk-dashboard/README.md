# ESG Risk Dashboard

A React-based dashboard for visualizing ESG risk scores and incidents, built with Vite, TypeScript, Redux, D3.js, and Jest.

## Setup Instructions
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Run tests: `npm test`
5. View Storybook: `npm run storybook`
6. Build Storybook: `npm run build-storybook`

## Component Architecture
- `App.tsx`: Orchestrates data fetching and rendering.
- `CompanyOverview.tsx`: Summarizes all company risk data (name, ID, score, trend, categories).
- `ESGChart.tsx`: Displays ESG category scores with D3.
- `HistoricalTrend.tsx`: Visualizes historical risk scores with D3.
- `IncidentTimeline.tsx`: Filters and lists incidents.
- `CriticalIncidents.tsx`: Highlights critical incidents.
- Redux manages state with `riskSlice`.

## Data Usage
- **company-risk-overview.json**: Fully displayed in `CompanyOverview`, with score/trend in `RiskScore` and categories in `ESGChart`.
- **incidents.json**: Powers incident timeline and critical incidents.
- **risk-score-history.json**: Drives the historical trend chart.
- **esg-categories.json** and **severity-levels.json**: Not used directly, as data is embedded in other files.

## Storybook Documentation
Run `npm run storybook` to view:
- **CompanyOverview**: Full company risk summary.
- **RiskScore**: Overall score with trend.
- **ESGChart**: ESG category bar chart.
- **HistoricalTrend**: Historical score line chart.
- **IncidentTimeline**: Filtered incident list.
- **CriticalIncidents**: Critical incident highlights.

## Key Design Decisions
- **Vite**: Fast development and ES modules.
- **TypeScript**: Type safety.
- **Redux**: Centralized state management.
- **D3.js**: Flexible visualizations.
- **Jest**: Comprehensive testing.
- **MUI**: Responsive and accessible UI.
- **Storybook**: Interactive component documentation.

## Management Approach
- Redux Toolkit for state management.
- JSON files simulate API calls.
- Jest tests cover components and logic.
- Storybook documents component usage.

## Performance Considerations
- Memoization prevents unnecessary renders.
- D3 updates optimized.
- Lazy loading planned for future.

## Demo Video
See `demo.mp4` for a 5-minute walkthrough.