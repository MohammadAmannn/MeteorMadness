'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function WorldMap({ impactPoint, craterSize, tsunamiRadius, earthquakeRadius, onLocationSelect }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 300;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Projection
    const projection = d3.geoNaturalEarth1()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw basic world map (simplified without topojson)
    const land = {
      type: "FeatureCollection",
      features: [
        // Simple continents (approximate)
        { type: "Feature", geometry: { type: "Polygon", coordinates: [[[-100, 30], [-60, 50], [-70, 20], [-100, 30]]] } }, // North America
        { type: "Feature", geometry: { type: "Polygon", coordinates: [[[-60, -20], [-30, 10], [-40, -40], [-60, -20]]] } }, // South America
        { type: "Feature", geometry: { type: "Polygon", coordinates: [[[-10, 30], [40, 50], [50, 30], [20, 10], [-10, 30]]] } }, // Europe/Asia
        { type: "Feature", geometry: { type: "Polygon", coordinates: [[[100, -10], [150, -20], [120, -40], [100, -10]]] } } // Australia
      ]
    };

    // Draw land masses
    svg.selectAll('.land')
      .data(land.features)
      .enter().append('path')
      .attr('class', 'land')
      .attr('d', path)
      .style('fill', '#4a5568')
      .style('stroke', '#2d3748')
      .style('stroke-width', 0.5);

    // Draw impact effects
    if (impactPoint) {
      const [x, y] = projection([impactPoint.lng, impactPoint.lat]);
      
      // Impact epicenter
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4)
        .style('fill', '#ff0000')
        .style('stroke', '#ffffff')
        .style('stroke-width', 2);

      // Crater zone
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', Math.max(3, (craterSize || 500) / 50000))
        .style('fill', '#ff0000')
        .style('opacity', 0.3)
        .style('stroke', '#ff0000')
        .style('stroke-width', 1);

      // Earthquake zone
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', Math.max(10, (earthquakeRadius || 10000) / 100000))
        .style('fill', 'none')
        .style('stroke', '#ffaa00')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '5,5');

      // Tsunami zone
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', Math.max(15, (tsunamiRadius || 5000) / 100))
        .style('fill', 'none')
        .style('stroke', '#0066ff')
        .style('stroke-width', 2);
    }
    svg.on("click", function (event) {
  const [x, y] = d3.pointer(event);

  const coords = projection.invert([x, y]);

  if (!coords) return;

  const [lng, lat] = coords;

  if (onLocationSelect) {
    onLocationSelect({ lat, lng });
  }
});

  }, [impactPoint, craterSize, tsunamiRadius, earthquakeRadius,onLocationSelect]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white text-lg mb-2">🗺️ Impact Zone Visualization</h3>
      <div className="flex justify-center">
        <svg ref={svgRef} className="w-full h-64 bg-blue-900 rounded border border-blue-700"></svg>
      </div>
      <div className="flex flex-wrap gap-4 mt-3 text-white text-sm justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          Impact Epicenter
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 opacity-30"></div>
          Crater Zone
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-yellow-500 rounded-full mr-2"></div>
          Earthquake Zone
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-blue-500 rounded-full mr-2"></div>
          Tsunami Zone
        </div>
      </div>
    </div>
  );
}