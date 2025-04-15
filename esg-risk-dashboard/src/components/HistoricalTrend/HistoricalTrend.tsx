import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography, CircularProgress } from '@mui/material';
import { HistoricalData } from '../../features/riskSlice';

interface HistoricalTrendProps {
  data: HistoricalData[];
  loading?: boolean;
  error?: string | null;
  width?: number;
  height?: number;
}

const HistoricalTrend: React.FC<HistoricalTrendProps> = ({
  data = [],
  loading = false,
  error = null,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const metrics = [
    { key: 'overall', color: 'steelblue', label: 'Overall' },
    { key: 'environmental', color: 'forestgreen', label: 'Environmental' },
    { key: 'social', color: 'darkorange', label: 'Social' },
    { key: 'governance', color: 'purple', label: 'Governance' },
  ];

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 120, bottom: 50, left: 50 };

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(d.overall, d.environmental, d.social, d.governance)
        ) || 100,
      ])
      .range([height - margin.bottom, margin.top])
      .nice();

    svg.selectAll('*').remove();

    
    metrics.forEach(({ key, color }) => {
      const line = d3
        .line()
        .x((d: any) => xScale(new Date(d.date)))
        .y((d: any) => yScale(d[key]));

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('aria-label', `${key} trend line`);
    });

    
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y')))
      .attr('aria-hidden', 'true');

    
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .attr('aria-hidden', 'true');

    
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);

    metrics.forEach(({ label, color }, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color)
        .attr('aria-label', `${label} legend color`);

      legendRow
        .append('text')
        .attr('x', 15)
        .attr('y', 10)
        .attr('font-size', '12px')
        .text(label);
    });
  }, [data, width, height]);

  if (loading) {
    return (
      <Box sx={{ mb: 3 }} role="region" aria-label="Historical Risk Trend">
        <Typography variant="h6">Historical Risk Trend</Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }} role="region" aria-label="Historical Risk Trend">
        <Typography variant="h6">Historical Risk Trend</Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }} role="region" aria-label="Historical Risk Trend">
      <Typography variant="h6">Historical Risk Trend</Typography>
      <svg ref={svgRef} width={width} height={height}></svg>
    </Box>
  );
};

export default HistoricalTrend;