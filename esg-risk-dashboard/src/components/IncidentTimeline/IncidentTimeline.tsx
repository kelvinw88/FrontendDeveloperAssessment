import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Modal,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { RootState } from '../../store';

interface Source {
  title: string;
  url: string;
  publishDate: string;
}

interface Incident {
  id: string;
  title: string;
  date: string;
  category: string;
  subcategory: string;
  severity: string;
  description: string;
  detailedDescription: string;
  location: string;
  riskScoreImpact: { overall: number; environmental: number; social: number; governance: number };
  sources: Source[];
}





const IncidentTimeline: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    incidents,
    loadingIncidents,
    errorIncidents,
    esgCategories,
    severityLevels
  } = useSelector((state: RootState) => state.risk);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('');
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [openModal, setOpenModal] = useState(false);


  // Filter incidents
  const filteredIncidents = React.useMemo(() => {
    return incidents.filter((incident) => {
      const incidentDate = new Date(incident.date);
      const [startDate, endDate] = dateRange;

      // Date filter
      const inDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      // Title filter
      const inTitle = !titleFilter ||
        incident.title.toLowerCase().includes(titleFilter.toLowerCase());

      // Category filter
      const inCategory = !categoryFilter ||
        incident.category.toLowerCase() === categoryFilter.toLowerCase();

      // Subcategory filter
      const inSubcategory = !subcategoryFilter ||
        incident.subcategory.toLowerCase() === subcategoryFilter.toLowerCase();

      // Severity filter
      const inSeverity = !severityFilter ||
        incident.severity.toLowerCase() === severityFilter.toLowerCase();

      return inDateRange && inTitle && inCategory && inSubcategory && inSeverity;
    });
  }, [incidents, dateRange, titleFilter, categoryFilter, subcategoryFilter, severityFilter]);

  useEffect(() => {
    if (!svgRef.current || !filteredIncidents.length || !severityLevels.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous elements

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 120, bottom: 50, left: 50 };


    // Create a tooltip div
    const tooltip = d3.select(svgRef.current.parentNode)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(filteredIncidents, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredIncidents, d => d.riskScoreImpact.overall) || 100])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(["environmental", "social", "governance"])
      .range(["#4CAF50", "#2196F3", "#9C27B0"]);

    const radius = d3.scaleSqrt()
      .domain([1, severityLevels.length])
      .range([5, 15]);

    // Draw bubbles with hover effects
    svg.selectAll("circle")
      .data(filteredIncidents)
      .join("circle")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.riskScoreImpact.overall))
      .attr("r", d => {
        const sevIndex = severityLevels.findIndex(s => s.id === d.severity.toLowerCase());
        return radius(sevIndex + 1);
      })
      .attr("fill", d => color(d.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .style("opacity", 1);

        tooltip.html(`
            <strong>${d.title}</strong>
            <div>${d.category} • ${d.severity}</div>
            <div>${new Date(d.date).toLocaleDateString()}</div>
            <div>Impact: ${d.riskScoreImpact.overall}</div>
          `)
          .style("visibility", "visible");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1)
          .style("opacity", 0.8);

        tooltip.style("visibility", "hidden");
      })
      .on('click', (event, d) => {
        setSelectedIncident(d);
        setOpenModal(true); // Open modal on click
      });

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    // Add Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Risk Score Impact");

    svg.attr("aria-label", "Incident timeline visualization");
    svg.selectAll("circle")
      .attr("aria-label", d => `${d.title}, ${d.severity} severity`);
    // Add legend for categories
    const categoryLegend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    esgCategories.forEach((category, i) => {
      categoryLegend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 20)
        .attr("r", 5)
        .attr("fill", color(category.id));

      categoryLegend.append("text")
        .attr("x", 10)
        .attr("y", i * 20 + 5)
        .text(category.name)
        .style("font-size", "12px");
    });

    // Add legend for severity
    const severityLegend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top + esgCategories.length * 20 + 20})`);

    severityLevels.forEach((level, i) => {
      severityLegend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 20)
        .attr("r", radius(i + 1))
        .attr("fill", "#000")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5);

      severityLegend.append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 5)
        .text(level.name)
        .style("font-size", "12px");
    });

  }, [filteredIncidents, severityLevels, esgCategories]);

  if (loadingIncidents) {
    return (
      <Box sx={{ mb: 3 }} role="region" aria-label="Incident Timeline">
        <Typography variant="h6">Incident Timeline</Typography>
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
        <Typography variant="h6">Incident Timeline</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
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
          <FormControl sx={{ minWidth: 120 }}>
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
            <FormControl sx={{ minWidth: 120 }}>
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
                  .find(c => c.id === categoryFilter)
                  ?.subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {/* Severity filter */}
          <FormControl sx={{ minWidth: 120 }}>
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
          />
          <DatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => {
              setDateRange([dateRange[0], newValue]);
              setSelectedIncident(null);
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>
        {filteredIncidents.length ? (
          <Box>
            <svg ref={svgRef} width="800" height="400"></svg>
            {/* Modal for Incident Details */}
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              aria-labelledby="incident-details-modal"
              aria-describedby="incident-details-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  height: '70vh',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  overflow: 'auto',
                  p: 4,
                }}
              >
                {selectedIncident && (
                  <>
                    <Typography id="incident-details-modal" variant="h6" component="h2">
                      Incident Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="ID" secondary={selectedIncident.id} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Title" secondary={selectedIncident.title} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Date"
                          secondary={new Date(selectedIncident.date).toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Category" secondary={selectedIncident.category} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Subcategory"
                          secondary={selectedIncident.subcategory}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Severity" secondary={selectedIncident.severity} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Description"
                          secondary={selectedIncident.description}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Detailed Description"
                          secondary={selectedIncident.detailedDescription}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Location" secondary={selectedIncident.location} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Risk Score Impact"
                          secondary={
                            <>
                              Overall: {selectedIncident.riskScoreImpact.overall}
                              <br />
                              Environmental: {selectedIncident.riskScoreImpact.environmental}
                              <br />
                              Social: {selectedIncident.riskScoreImpact.social}
                              <br />
                              Governance: {selectedIncident.riskScoreImpact.governance}
                            </>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Sources"
                          secondary={
                            selectedIncident.sources.length ? (
                              <List dense>
                                {selectedIncident.sources.map((source, i) => (
                                  <ListItem key={i}>
                                    <ListItemText
                                      primary={source.title}
                                      secondary={
                                        <>
                                          <a href={source.url} target="_blank" rel="noopener">
                                            {source.url}
                                          </a>
                                          <br />
                                          Published:{' '}
                                          {new Date(source.publishDate).toLocaleString()}
                                        </>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              'None'
                            )
                          }
                        />
                      </ListItem>
                    </List>
                    <Button onClick={() => setOpenModal(false)}>Close</Button>
                  </>
                )}
              </Box>
            </Modal>
          </Box>
        ) : (
          <Typography>No incidents match the filters.</Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default IncidentTimeline;