import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncidentModal from './IncidentModal';
import { Incident } from '../../features/riskSlice';

describe('IncidentModal', () => {
  const mockIncident: Incident = {
    id: '123',
    title: 'Test Incident',
    date: '2023-01-01T00:00:00Z',
    category: 'Environmental',
    subcategory: 'Pollution',
    severity: 'High',
    description: 'Test description',
    detailedDescription: 'Detailed test description',
    location: 'Test Location',
    riskScoreImpact: {
      overall: 75,
      environmental: 80,
      social: 70,
      governance: 65,
    },
    sources: [
      {
        title: 'Test Source',
        url: 'https://example.com',
        publishDate: '2023-01-01T00:00:00Z',
      },
    ],
  };

  const mockOnClose = jest.fn();

  it('should render modal with incident details', () => {
    render(<IncidentModal incident={mockIncident} open={true} onClose={mockOnClose} />);
    
    // Check modal is open using test ID
    expect(screen.getByTestId('incident-modal')).toBeInTheDocument();
    expect(screen.getByTestId('incident-modal-content')).toBeInTheDocument();
    
    // Check content using test IDs
    expect(screen.getByTestId('incident-id')).toHaveTextContent('ID');
    expect(screen.getByTestId('incident-id')).toHaveTextContent('123');
    
    expect(screen.getByTestId('incident-title')).toHaveTextContent('Title');
    expect(screen.getByTestId('incident-title')).toHaveTextContent('Test Incident');
    
    // Test close button
    expect(screen.getByTestId('close-modal-button')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    render(<IncidentModal incident={mockIncident} open={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByTestId('close-modal-button');
    await userEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking outside the modal', async () => {
    render(<IncidentModal incident={mockIncident} open={true} onClose={mockOnClose} />);
    
    // Click on the modal backdrop (using the modal content area)
    const modalContent = screen.getByTestId('incident-modal-content');
    await userEvent.click(modalContent);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});