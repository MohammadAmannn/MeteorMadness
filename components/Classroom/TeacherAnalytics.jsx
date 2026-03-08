import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function TeacherAnalytics({ assignments, submissions }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || submissions.length === 0) return;

        // Clear old chart
        d3.select(chartRef.current).selectAll('*').remove();

        // Prepare data
        // Energy levels count (ranges)
        const energyData = [
            { range: '< 100 Mt', count: submissions.filter(s => s.results?.energy?.energyMegatons < 100).length },
            { range: '100-1k Mt', count: submissions.filter(s => s.results?.energy?.energyMegatons >= 100 && s.results?.energy?.energyMegatons < 1000).length },
            { range: '> 1k Mt', count: submissions.filter(s => s.results?.energy?.energyMegatons >= 1000).length }
        ];

        // Mitigation Strategies Pie
        const mitigationDataMap = {};
        submissions.forEach(s => {
            const type = s.results?.mitigationUsed || 'none';
            mitigationDataMap[type] = (mitigationDataMap[type] || 0) + 1;
        });
        const mitigationData = Object.entries(mitigationDataMap).map(([label, value]) => ({ label, value }));

        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // BAR CHART (Energy)
        const chartWidth = 300;
        const x = d3.scaleBand()
            .domain(energyData.map(d => d.range))
            .range([margin.left, chartWidth - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(energyData, d => d.count) || 1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('fill', '#8B5CF6') // Purple
            .selectAll('rect')
            .data(energyData)
            .join('rect')
            .attr('x', d => x(d.range))
            .attr('y', d => y(d.count))
            .attr('height', d => y(0) - y(d.count))
            .attr('width', x.bandwidth());

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('fill', '#9CA3AF');

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .selectAll('text')
            .attr('fill', '#9CA3AF');

        // Title
        svg.append('text')
            .attr('x', chartWidth / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#D1D5DB')
            .style('font-size', '12px')
            .text('Simulation Energy Levels');

        // PIE CHART (Mitigation)
        const radius = Math.min(180, height - margin.top - margin.bottom) / 2;
        const gPie = svg.append('g')
            .attr('transform', `translate(${chartWidth + 120}, ${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(mitigationData.map(d => d.label))
            .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280']);

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.5) // donut
            .outerRadius(radius);

        const arcs = gPie.selectAll('path')
            .data(pie(mitigationData))
            .join('path')
            .attr('fill', d => color(d.data.label))
            .attr('d', arc)
            .append('title')
            .text(d => `${d.data.label}: ${d.data.value}`);

        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${chartWidth + 5}, ${margin.top})`);

        mitigationData.forEach((d, i) => {
            legend.append('rect')
                .attr('y', i * 20)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', color(d.label));

            legend.append('text')
                .attr('x', 15)
                .attr('y', i * 20 + 9)
                .attr('fill', '#9CA3AF')
                .style('font-size', '10px')
                .text(`${d.label} (${d.value})`);
        });

    }, [submissions]);

    return (
        <div className="animate-fade-in text-white/90">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Student Analytics</h2>

            {submissions.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-900/40 rounded-lg">
                    <p>No student submissions yet.</p>
                </div>
            ) : (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex flex-col items-center">
                    <h3 className="text-lg text-purple-300 font-bold mb-4 w-full text-left">Overall Performance</h3>
                    <div ref={chartRef} className="overflow-x-auto w-full flex justify-center py-4 bg-gray-950/50 rounded-lg"></div>

                    <div className="mt-8 w-full border-t border-gray-700 pt-6">
                        <h3 className="text-lg text-blue-300 font-bold mb-4">Recent Submissions ({submissions.length})</h3>
                        <div className="grid gap-2">
                            {submissions.slice(-5).reverse().map(sub => {
                                const assign = assignments.find(a => a.id === sub.assignmentId);
                                return (
                                    <div key={sub.id} className="bg-gray-800/80 p-3 rounded text-sm grid grid-cols-4 gap-4 items-center hover:bg-gray-800 transition">
                                        <div className="font-bold text-white flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center text-xs">
                                                {sub.studentName.charAt(0).toUpperCase()}
                                            </div>
                                            {sub.studentName}
                                        </div>
                                        <div className="text-gray-400 truncate">{assign?.title || 'Unknown Assignment'}</div>
                                        <div>
                                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">🛡️ {sub.results?.mitigationUsed || 'none'}</span>
                                        </div>
                                        <div className="text-red-400 text-right font-mono text-xs shadow-sm bg-gray-900 px-2 py-1 rounded inline-block justify-self-end">
                                            {sub.results?.energy?.energyMegatons?.toLocaleString() || 0} Mt
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
