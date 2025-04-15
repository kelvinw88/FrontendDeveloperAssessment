import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const IncidentTimeline: React.FC = () => {
  const incidents = useSelector((state: RootState) => state.risk.incidents);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [severity, setSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter(incident => {
    const date = new Date(incident.date);
    return (
      (!startDate || date >= startDate) &&
      (!endDate || date <= endDate) &&
      (category === 'all' || incident.category === category) &&
      (severity === 'all' || incident.severity === severity)
    );
  });

  return (
    <Box sx={{ mb: 3 }} role="region" aria-label="Incident Timeline">
      <Typography variant="h6">Incident Timeline</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" gap={2} mb={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="environmental">Environmental</MenuItem>
            <MenuItem value="social">Social</MenuItem>
            <MenuItem value="governance">Governance</MenuItem>
          </TextField>
          <TextField
            select
            label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </TextField>
        </Box>
      </LocalizationProvider>
      <Box>
        {filteredIncidents.map(incident => (
          <Box key={incident.id} sx={{ p: 2, borderBottom: '1px solid #ddd' }} role="article">
            <Typography variant="subtitle1">{incident.title}</Typography>
            <Typography variant="body2">{new Date(incident.date).toLocaleDateString()}</Typography>
            <Typography variant="body2" color={incident.severity === 'critical' ? 'error' : 'textSecondary'}>
              Severity: {incident.severity}
            </Typography>
            <Typography variant="body2">{incident.description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default IncidentTimeline;