import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const CriticalIncidents: React.FC = () => {
  const { incidents, loading } = useSelector((state: RootState) => state.risk);

  const criticalIncidents = incidents.filter((incident) => {
    const incidentDate = new Date(incident.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return (
      (incident.severity === 'critical' || incident.severity === 'high') &&
      incidentDate >= thirtyDaysAgo
    );
  });

  if (loading) {
    return (
      <Box sx={{ mb: 3 }} role="region" aria-label="Critical Incidents">
        <Typography variant="h6">Critical Incidents (Last 30 Days)</Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }} role="region" aria-label="Critical Incidents">
      <Typography variant="h6">Critical Incidents (Last 30 Days)</Typography>
      {criticalIncidents.length ? (
        <List>
          {criticalIncidents.map((incident) => (
            <ListItem key={incident.id}>
              <ListItemText
                primary={incident.title}
                secondary={`Date: ${incident.date} | Severity: ${incident.severity} | Impact: ${incident.riskScoreImpact.overall}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No critical incidents in the last 30 days.</Typography>
      )}
    </Box>
  );
};

export default CriticalIncidents;