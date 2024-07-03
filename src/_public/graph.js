import * as d3 from "d3";
import PageRank from "./pagerank.js";

export function draw_graph(data) {
  // Clear previous content
  d3.select("#chart_svg").selectAll("*").remove();
  const selectedDataPoint = window.selectedDataPoint;
  console.log("Selected Data Point in draw_graph:", selectedDataPoint);
  console.log("data:", data);

  // Create links data
  const linksData = data.flatMap(d => d.recommendations.map(rec => ({ source: d.id, target: rec })));

  // SVG dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3.select("#chart_svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", (event) => {
      svg.attr("transform", event.transform);
    }))
    .append("g");

  const simulation = d3.forceSimulation(data)
    .force("link", d3.forceLink(linksData).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(linksData)
    .enter().append("line")
    .attr("stroke-width", 1.5)
    .attr("stroke", "#999");

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", d => Math.sqrt(d.pageRank * 100000))
    .attr("fill", d => selectedDataPoint === d.id ? "red" : "steelblue")
    .on("click", (event, d) => {
      console.log(`Clicked Node ID: ${d.id}`);
      window.selectedDataPoint = d.id;
      highlightNode(d.id);  // Highlight the selected node
    })
    .call(drag(simulation));

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("dy", 3)
    .attr("dx", -5)
    .text(d => d.name);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // Function to highlight the selected node
  function highlightNode(selectedId) {
    node
      .attr("fill", d => selectedId === d.id ? "red" : "steelblue")
      .each(function(d) {
        if (selectedId === d.id) {
          d3.select(this).raise(); // Bring the selected circle to the front
        }
      });
  }
}
