import React from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Link
} from '@mui/material';
import { Incident } from '../../features/riskSlice';

interface IncidentModalProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
}

const IncidentModal: React.FC<IncidentModalProps> = ({ incident, open, onClose }) => {

  if (!incident) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="incident-details-modal-title"
      aria-describedby="incident-details-modal-description"
      data-testid="incident-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500, md: 600 },
          maxHeight: '85vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          p: 4,
          overflowY: 'auto',
        }}
        data-testid="incident-modal-content"
      >
        {/* Use the passed incident data */}
        <Typography id="incident-details-modal-title" variant="h6" component="h2" gutterBottom>
          Incident Details
        </Typography>
        <List dense sx={{ mb: 2 }} data-testid="incident-details-list">
          <ListItem data-testid="incident-id">
            <ListItemText primary="ID" secondary={incident.id} />
          </ListItem>
          <ListItem data-testid="incident-title">
            <ListItemText primary="Title" secondary={incident.title} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Date"
              secondary={new Date(incident.date).toLocaleString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Category" secondary={incident.category} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Subcategory"
              secondary={incident.subcategory || 'N/A'}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Severity" secondary={incident.severity} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Description"
              secondary={incident.description}
              secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Detailed Description"
              secondary={incident.detailedDescription || 'N/A'}
              secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Location" secondary={incident.location} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Risk Score Impact"
              secondary={
                <>
                  Overall: {incident.riskScoreImpact.overall}
                  <br />
                  Environmental: {incident.riskScoreImpact.environmental}
                  <br />
                  Social: {incident.riskScoreImpact.social}
                  <br />
                  Governance: {incident.riskScoreImpact.governance}
                </>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start"> {/* Align items start for better list display */}
            <ListItemText
              primary="Sources"
              secondary={
                incident.sources?.length ? (
                  <List dense disablePadding> {/* Disable padding for nested list */}
                    {incident.sources.map((source, i) => (
                      <ListItem key={i} disableGutters> {/* Disable gutters for tighter spacing */}
                        <ListItemText
                          primary={source.title}
                          secondary={
                            <>
                              <Link href={source.url} target="_blank" rel="noopener noreferrer" variant="body2">
                                {source.url}
                              </Link>
                              <br />
                              <Typography variant="caption" display="block"> {/* Use Typography for caption */}
                                Published:{' '}
                                {source.publishDate ? new Date(source.publishDate).toLocaleString() : 'N/A'}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  'None provided'
                )
              }
            />
          </ListItem>
        </List>
        <Button data-testid="close-modal-button" variant="contained" onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default IncidentModal;