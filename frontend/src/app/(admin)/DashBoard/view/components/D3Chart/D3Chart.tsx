import React, { useEffect } from 'react';
import * as d3 from 'd3';

interface Booking {
  date: string; // YYYY-MM-DD format
  count: number; // Number of bookings on that date
  car: string;   // The car identifier (could be the car name or ID)
}

interface BookingsChartProps {
  data: Booking[];
}

const BookingsChart: React.FC<BookingsChartProps> = ({ data }) => {
  useEffect(() => {
    if (!data || !data.length) return;

    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Parse date from string to Date object
    const parseTime = d3.timeParse('%Y-%m-%d');

    // Convert data into a Date object for d3 to understand
    const parsedData = data.map(d => ({
      ...d,
      date: parseTime(d.date) as Date,
    }));

    // Group data by car
    const nestedData = d3.group(parsedData, d => d.car);

    // Set up scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, d => d.count) || 0])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10); // Color for different cars

    // Remove any existing svg before creating a new one
    d3.select('#bookings-chart').select('svg').remove();

    // Create SVG container
    const svg = d3
      .select('#bookings-chart')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add the X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g').call(d3.axisLeft(y));

    // Create a line generator
    const line = d3
      .line<Booking>()
      .x(d => x(d.date)!)
      .y(d => y(d.count)!)
      .curve(d3.curveMonotoneX);

    // Draw a line for each car
    nestedData.forEach((values, car) => {
      svg
        .append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', color(car) as string)
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Add a label at the end of each line
      const lastEntry = values[values.length - 1]; // Get the last entry for this car
      svg
        .append('text')
        .attr('x', x(lastEntry.date) as number + 5) // Position slightly to the right of the last point
        .attr('y', y(lastEntry.count) as number)
        .attr('fill', color(car) as string) // Same color as the line
        .attr('dy', '0.35em')
        .attr('font-size', '12px')
        .text(car); // Use the car name as the label
    });

  }, [data]);

  return <div id="bookings-chart" style={{paddingRight:'20'}}></div>;
};

export default BookingsChart;
