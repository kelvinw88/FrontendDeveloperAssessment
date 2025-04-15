import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  Button,
  LinearProgress,
} from '@mui/material';
import { format, subDays, parseISO, isAfter } from 'date-fns';
import IncidentModal from '../IncidentModal/IncidentModal';
import { CriticalIncident, Incident } from '../../store/riskSlice';

const HIGH_SEVERITY_RATINGS: string[] = ['high', 'critical'];
const SIGNIFICANT_IMPACT_THRESHOLD: number = 7.0;
const DAYS_AGO_FOR_RECENCY: number = 30;

interface CriticalIncidentsProps {
  criticalIncidents: CriticalIncident[];
  loadingCriticalIncidents: boolean;
  errorCriticalIncidents: string | null;
  incidents: Incident[];
}

const getSeverityColor = (severity: string): ('error' | 'warning' | 'info' | 'success' | 'default') => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const CriticalIncidents: React.FC<CriticalIncidentsProps> = ({
  criticalIncidents,
  loadingCriticalIncidents,
  errorCriticalIncidents,
  incidents,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncidentDetails, setSelectedIncidentDetails] = useState<Incident | null>(null);

  const handleViewDetails = (incidentId: string) => {
    const details = incidents.find((incident) => incident.id === incidentId);
    setSelectedIncidentDetails(details || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIncidentDetails(null);
  };

  if (loadingCriticalIncidents) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Loading Critical Incidents...</Typography>
      </Box>
    );
  }

  if (errorCriticalIncidents) {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Highlighted Critical Incidents
        </Typography>
        <Typography color="error">{errorCriticalIncidents}</Typography>
      </Box>
    );
  }

  const now = new Date();
  const cutoffDate = subDays(now, DAYS_AGO_FOR_RECENCY);

  // First deduplicate incidents by ID
  const deduplicatedIncidents = criticalIncidents.reduce((acc: CriticalIncident[], incident) => {
    if (!acc.some((i) => i.id === incident.id)) {
      acc.push(incident);
    }
    return acc;
  }, []);

  // Then apply filtering criteria
  const highlightedIncidents = deduplicatedIncidents.filter((incident) => {
    try {
      const incidentDate = parseISO(incident.date);
      const isRecent = isAfter(incidentDate, cutoffDate);
      const isHighSeverity = HIGH_SEVERITY_RATINGS.includes(incident.severity?.toLowerCase());
      const isSignificantImpact = incident.riskScoreImpact >= SIGNIFICANT_IMPACT_THRESHOLD;
      
      // Only show incidents that are recent AND (high severity OR significant impact)
      return isRecent && (isHighSeverity || isSignificantImpact);
    } catch (e) {
      console.error(`Error parsing date for incident ${incident.id}: ${incident.date}`, e);
      return false;
    }
  });

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Highlighted Critical Incidents
      </Typography>

      {highlightedIncidents.length === 0 && !loadingCriticalIncidents && (
        <Typography sx={{ mt: 2, fontStyle: 'italic' }}>
          No critical incidents meeting the highlighting criteria (recent, high severity, or significant impact) found.
        </Typography>
      )}

      <Grid container spacing={2}>
        {highlightedIncidents.map((incident) => (
          <Grid item xs={12} sm={6} md={4} key={incident.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {incident.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                  <Tooltip title={`Severity: ${incident.severity}`}>
                    <Chip
                      label={incident.severity.toUpperCase()}
                      color={getSeverityColor(incident.severity)}
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title={`Risk Score Impact: ${incident.riskScoreImpact}`}>
                    <Chip
                      label={`Impact: ${incident.riskScoreImpact}`}
                      variant='outlined'
                      size="small"
                      sx={{
                        borderColor: incident.riskScoreImpact >= SIGNIFICANT_IMPACT_THRESHOLD ? 'error.main' : 'default',
                        color: incident.riskScoreImpact >= SIGNIFICANT_IMPACT_THRESHOLD ? 'error.main' : 'text.secondary'
                      }}
                    />
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(incident.date), 'MMM d, yyyy')}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {incident.summary}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Category: {incident.category} | Location: {incident.location}
                </Typography>
              </CardContent>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="overline" display="block" sx={{ mb: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
                  Impact Magnitude
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(incident.riskScoreImpact / 10) * 100}
                  color={incident.riskScoreImpact >= SIGNIFICANT_IMPACT_THRESHOLD ? 'error' : 'primary'}
                  sx={{ height: 5, borderRadius: 1 }}
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  {incident.riskScoreImpact} / 10
                </Typography>
              </Box>
              <Button size="small" onClick={() => handleViewDetails(incident.id)}>
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <IncidentModal
        open={modalOpen}
        onClose={handleCloseModal}
        incident={selectedIncidentDetails}
      />
    </Box>
  );
};

export default CriticalIncidents;