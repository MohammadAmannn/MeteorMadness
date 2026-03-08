'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ImpactChart({ results }) {
    const chartRef = useRef();

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear old chart
        d3.select(chartRef.current).selectAll('*').remove();

        if (!results) {
            d3.select(chartRef.current)
                .append('div')
                .attr('class', 'text-gray-500 text-sm text-center pt-8')
                .text('Run simulation to view energy comparison chart');
            return;
        }

        const { energyMegatons } = results.energy;

        // Use logarithmic scale or fixed comparison values
        // Compare against known events (Megatons):
        // Hiroshima: 0.015 MT
        // Tunguska: 15 MT
        // Tsar Bomba: 50 MT
        // Chicxulub (Dinosaur killer): 100,000,000 MT

        const getComparisonData = () => {
            let maxData = 100;
            let data = [
                { name: "Hiroshima", value: 0.015, color: "#aaa" },
                { name: "Tunguska", value: 15, color: "#ffaa00" },
            ];

            if (energyMegatons > 50) {
                data.push({ name: "Tsar Bomba", value: 50, color: "#ff5500" });
            }

            data.push({ name: "This Asteroid", value: energyMegatons, color: "#ff0000" });

            // Sort by value ascending
            data.sort((a, b) => a.value - b.value);
            return data;
        };

        const data = getComparisonData();

        // Set dimensions
        const margin = { top: 20, right: 30, bottom: 30, left: 100 },
            width = chartRef.current.clientWidth - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        const maxVal = d3.max(data, d => d.value);
        // Use log scale if gap is extreme
        const useLog = maxVal > 1000;

        const x = (useLog ? d3.scaleLog().base(10).clamp(true).domain([0.01, maxVal * 1.5]) : d3.scaleLinear().domain([0, maxVal * 1.2]))
            .range([0, width]);

        const xAxis = d3.axisBottom(x)
            .ticks(5, useLog ? ".1s" : "s")
            .tickFormat(d => d + " MT");

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .attr("color", "#ccc");

        // Add Y axis
        const y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.name))
            .padding(.3);

        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("color", "#fff")
            .style("font-size", "11px");

        // Add bars
        svg.selectAll("myRect")
            .data(data)
            .join("rect")
            .attr("x", x(useLog ? 0.01 : 0))
            .attr("y", d => y(d.name))
            .attr("width", d => x(d.value))
            .attr("height", y.bandwidth())
            .attr("fill", d => d.color)
            .attr("opacity", 0.8)
            .on("mouseover", function () {
                d3.select(this).attr("opacity", 1);
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 0.8);
            });

        // Add value labels
        svg.selectAll("myLabels")
            .data(data)
            .join("text")
            .attr("x", d => x(d.value) + 5)
            .attr("y", d => y(d.name) + y.bandwidth() / 2 + 4)
            .text(d => d.value.toLocaleString() + " MT")
            .attr("fill", "white")
            .style("font-size", "10px");


    }, [results]);

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/30">
            <h3 className="text-lg font-bold mb-2">📊 Energy Comparison</h3>
            <div ref={chartRef} className="w-full h-52"></div>
        </div>
    );
}
