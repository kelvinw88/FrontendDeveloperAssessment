import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IncidentModal from '../IncidentModal/IncidentModal';
import { Incident, EsgCategory, SeverityLevel, RiskState } from '../../features/riskSlice';

interface IncidentTimelineProps {
  incidents: Incident[];
  loadingIncidents: RiskState['loadingIncidents'];
  errorIncidents: RiskState['errorIncidents'];
  esgCategories: EsgCategory[];
  severityLevels: SeverityLevel[];
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidents: propIncidents,
  loadingIncidents,
  errorIncidents,
  esgCategories,
  severityLevels,
}) => {
  // Ref for the SVG element
  const svgRef = useRef<SVGSVGElement>(null);
  // State for filtering
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('');
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  // State for modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Function to handle opening the modal
  const handleIncidentClick = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    setOpenModal(true);
  }, []);

  // Function to handle closing the modal
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  // Filter incidents based on the selected criteria
  const filteredIncidents = React.useMemo(() => {
    return propIncidents.filter((incident) => {
      const incidentDate = new Date(incident.date);
      const [startDate, endDate] = dateRange;

      // Date filter: Check if the incident date falls within the selected range
      const inDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      // Title filter: Check if the incident title includes the search term (case-insensitive)
      const inTitle =
        !titleFilter || incident.title.toLowerCase().includes(titleFilter.toLowerCase());

      // Category filter: Check if the incident category matches the selected category
      const inCategory =
        !categoryFilter || incident.category.toLowerCase() === categoryFilter.toLowerCase();

      // Subcategory filter: Check if the incident subcategory matches the selected subcategory
      const inSubcategory =
        !subcategoryFilter ||
        (incident.subcategory && incident.subcategory.toLowerCase() === subcategoryFilter.toLowerCase());

      // Severity filter: Check if the incident severity matches the selected severity
      const inSeverity =
        !severityFilter || incident.severity.toLowerCase() === severityFilter.toLowerCase();

      return inDateRange && inTitle && inCategory && inSubcategory && inSeverity;
    });
  }, [
    propIncidents,
    dateRange,
    titleFilter,
    categoryFilter,
    subcategoryFilter,
    severityFilter,
  ]);

  // Effect to draw the D3.js timeline
  useEffect(() => {
    // Ensure SVG ref is available, there are incidents to display, and severity levels are loaded
    if (!svgRef.current || !filteredIncidents.length || !severityLevels.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous elements

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 120, bottom: 50, left: 50 };

    // Create a tooltip div
    const tooltip = d3
      .select(svgRef.current.parentNode)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(filteredIncidents, (d) => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filteredIncidents, (d) => d.riskScoreImpact.overall) || 100])
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(esgCategories.map((cat) => cat.id))
      .range(['#4CAF50', '#2196F3', '#9C27B0']); // Ensure enough colors

    const radius = d3
      .scaleSqrt()
      .domain([1, severityLevels.length])
      .range([5, 15]);

    // Draw bubbles for each incident
    svg
      .selectAll('circle')
      .data(filteredIncidents)
      .join('circle')
      .attr('cx', (d) => x(new Date(d.date)))
      .attr('cy', (d) => y(d.riskScoreImpact.overall))
      .attr('r', (d) => {
        const sevIndex = severityLevels.findIndex((s) => s.id.toLowerCase() === d.severity.toLowerCase());
        return sevIndex !== -1 ? radius(sevIndex + 1) : radius(1); // Handle cases where severity might not be found
      })
      .attr('fill', (d) => color(d.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        // Highlight the circle on mouseover
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 2).style('opacity', 1);

        // Show the tooltip with incident information
        tooltip
          .html(`
            <strong>${d.title}</strong>
            <div>${d.category} • ${d.severity}</div>
            <div>${new Date(d.date).toLocaleDateString()}</div>
            <div>Impact: ${d.riskScoreImpact.overall}</div>
          `)
          .style('visibility', 'visible');
      })
      .on('mousemove', function (event) {
        // Get the bounding rectangle of the SVG element
        const svgBounds = svgRef.current!.getBoundingClientRect();
        // Calculate the relative position of the mouse within the SVG
        const xPosition = event.clientX - svgBounds.left;
        const yPosition = event.clientY - svgBounds.top;

        // Update tooltip position based on the mouse position relative to the SVG
        tooltip
          .style('top', yPosition + 10 + 'px')
          .style('left', xPosition + 10 + 'px');
      })
      .on('mouseout', function () {
        // Revert the circle style on mouseout
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1).style('opacity', 0.8);

        // Hide the tooltip on mouseout
        tooltip.style('visibility', 'hidden');
      })
      .on('click', (event, d) => {
        // Open the incident modal on click
        handleIncidentClick(d);
      });

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m-%d')));

    // Add Y axis
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // Add y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Risk Score Impact');

    // Accessibility attributes for the SVG
    svg.attr('aria-label', 'Incident timeline visualization');
    svg.selectAll('circle').attr('aria-label', (d) => `${d.title}, ${d.severity} severity`);

    // Add legend for categories
    const categoryLegend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);

    esgCategories.forEach((category, i) => {
      categoryLegend
        .append('circle')
        .attr('cx', 0)
        .attr('cy', i * 20)
        .attr('r', 5)
        .attr('fill', color(category.id));

      categoryLegend
        .append('text')
        .attr('x', 10)
        .attr('y', i * 20 + 5)
        .text(category.name)
        .style('font-size', '12px');
    });

    // Add legend for severity levels
    const severityLegend = svg
      .append('g')
      .attr(
        'transform',
        `translate(${width - margin.right + 20}, ${margin.top + esgCategories.length * 20 + 20})`,
      );

    severityLevels.forEach((level, i) => {
      severityLegend
        .append('circle')
        .attr('cx', 0)
        .attr('cy', i * 20)
        .attr('r', radius(i + 1))
        .attr('fill', '#000')
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5);

      severityLegend
        .append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 5)
        .text(level.name)
        .style('font-size', '12px');
    });
  }, [filteredIncidents, severityLevels, esgCategories, handleIncidentClick]);

  // Rendering logic based on loading and error states
  if (loadingIncidents) {
    return (
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }} role="region" aria-label="Incident Timeline">
        <Typography variant="h6" sx={{ mr: 2 }}>
          Incident Timeline
        </Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (errorIncidents) {
    return (
      <Box sx={{ mb: 3 }} role="region" aria-label="Incident Timeline">
        <Typography variant="h6">Incident Timeline</Typography>
        <Typography color="error">{errorIncidents}</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 3 }} role="region" aria-label="Incident Timeline">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Incident Timeline
        </Typography>
        {/* Filter controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Title filter */}
          <TextField
            label="Title"
            value={titleFilter}
            onChange={(e) => {
              setTitleFilter(e.target.value);
              setSelectedIncident(null);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* Category filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Category"
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter(''); // Reset subcategory when category changes
                setSelectedIncident(null);
              }}
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {esgCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory filter (only shown when a category is selected) */}
          {categoryFilter && (
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="subcategory-filter-label">Subcategory</InputLabel>
              <Select
                labelId="subcategory-filter-label"
                value={subcategoryFilter}
                label="Subcategory"
                onChange={(e) => {
                  setSubcategoryFilter(e.target.value);
                  setSelectedIncident(null);
                }}
                size="small"
              >
                <MenuItem value="">All Subcategories</MenuItem>
                {esgCategories
                  .find((c) => c.id === categoryFilter)
                  ?.subcategories?.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {/* Severity filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="severity-filter-label">Severity</InputLabel>
            <Select
              labelId="severity-filter-label"
              value={severityFilter}
              label="Severity"
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setSelectedIncident(null);
              }}
              size="small"
            >
              <MenuItem value="">All Severities</MenuItem>
              {severityLevels.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date filters */}
          <DatePicker
            label="Start Date"
            value={dateRange[0]}
            onChange={(newValue) => {
              setDateRange([newValue, dateRange[1]]);
              setSelectedIncident(null);
            }}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ minWidth: 150 }}
          />
          <DatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => {
              setDateRange([dateRange[0], newValue]);
              setSelectedIncident(null);
            }}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ minWidth: 150 }}
          />
        </Box>

        {/* Conditional rendering of the timeline or a message if no incidents match */}
        {filteredIncidents.length > 0 ? (
          <Box sx={{ position: 'relative' }}>
            <svg ref={svgRef} width="800" height="400"></svg>
            {/* Incident modal */}
            <IncidentModal
              incident={selectedIncident}
              open={openModal}
              onClose={handleCloseModal}
            />
          </Box>
        ) : (
          <Typography>No incidents match the current filters.</Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default IncidentTimeline;