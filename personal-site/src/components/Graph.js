import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function Graph({ nodes, links }) {
  const svgRef = useRef(null);
  const navigate = useNavigate(); // useNavigate hook for navigation


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear SVG to prevent duplication

    const width = 800;
    const height = 600;

    // Setup force simulation
    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collide", d3.forceCollide(d => Math.max(20, d.label.length * 4) + 20));

    // Define link elements
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter().append("line");

    // Define node elements
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("g");

    const circles = node.append("circle")
      .attr("r", d => Math.max(20, d.label.length * 5))  // Dynamic radius based on label length
      .attr("fill", d => d.color)

    const labels = node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")  // Center the text
      .attr("dy", "0.35em")           // Slightly adjust vertical alignment for better appearance
      .attr("fill", "white");

    // Node click and hover functionality
    node.each(function(d) {
      if (d.url) {
        d3.select(this).style("cursor", "pointer")
          .on("click", () => {
            if (!d.url) return;
            if (d.type === 'external') {
              window.open(d.url, "_blank");
            } else {
              navigate(d.url); // Use navigate for internal links
            }
          });
      }
    });

    // Hover interaction
    node.on("mouseover", (event, d) => {
      const connectedNodes = new Set([d.id]);
      links.forEach(link => {
        if (link.source.id === d.id) connectedNodes.add(link.target.id);
        if (link.target.id === d.id) connectedNodes.add(link.source.id);
      });

      circles.style('opacity', nodeD => connectedNodes.has(nodeD.id) ? 1 : 0.2);
      labels.style('text-decoration', nodeD => connectedNodes.has(nodeD.id) && nodeD.url ? "underline" : "none");      
      link.style('opacity', linkD => connectedNodes.has(linkD.source.id) && connectedNodes.has(linkD.target.id) ? 1 : 0.2);
    });

    node.on("mouseout", () => {
      circles.style('opacity', 1);
      link.style('opacity', 0.6);
      labels.style('text-decoration', "none");
    });
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

  }, [nodes, links, navigate]); // Redraw graph when nodes or links change

  return (
    <svg ref={svgRef} width="800" height="600"></svg>
  );
}

export default Graph;
