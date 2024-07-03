import * as d3 from "d3";

// Define a global variable to store the selected data point
window.selectedDataPoint = null;

export function draw_cluster_scatterplot(data) {
  console.log("TEST2");

  let svg = d3.select('#chart_svg').selectAll("*").remove();

  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 130,
  };

  svg = d3.select("#chart_svg");
  svg.append("g").attr("id", "g_chart");
  svg.append("g").attr("id", "g_x_axis_chart");
  svg.append("g").attr("id", "g_y_axis_chart");
  let g_scatterplot = d3.select("#g_chart");
  let g_x_axis_scatterplot = d3.select("#g_x_axis_chart");
  let g_y_axis_scatterplot = d3.select("#g_y_axis_chart");

  console.log("TEST7");

  let width = parseInt(svg.style("width"));
  let height = parseInt(svg.style("height"));
  console.log("TEST8");

  console.log("HEREEEE");

  console.log(data);
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.dataPoint[0])), d3.max(data.map((d) => d.dataPoint[0]))])
    .range([0, width - margin.left - margin.right]);

  console.log("TEST9");

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.dataPoint[1])), d3.max(data.map((d) => d.dataPoint[1]))])
    .range([height - margin.top - margin.bottom, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([...new Set(data.map(d => d.class))]);

  let scatterplot_circle = g_scatterplot
    .selectAll(".scatterplot_circle")
    .data(data);

  scatterplot_circle
    .enter()
    .append("circle")
    .attr("class", "scatterplot_circle")
    .merge(scatterplot_circle)
    .attr("fill", d => colorScale(d.centroidIndex))
    .attr("r", 5)
    .attr("cx", (d) => margin.left + xScale(d.dataPoint[0]))
    .attr("cy", (d) => yScale(d.dataPoint[1]) + margin.top)
    .on("click", function(event, d) {
      // Set the global variable to the selected data point
      window.selectedDataPoint = d.bgg_id;

      // Highlight the selected circle
      d3.selectAll(".scatterplot_circle").attr("stroke", "none");
      d3.select(this).attr("stroke", "black").attr("stroke-width", 5).raise();

      // Optional: Log the selected data point
      console.log("Selected Data Point:", d.bgg_id);
    });

  scatterplot_circle.exit().remove();

  // Update the stroke attribute for highlighting
  g_scatterplot.selectAll(".scatterplot_circle")
    .attr("stroke", d => {
      console.log(window.selectedDataPoint)
      // console.log(d.bgg_id)
      if(window.selectedDataPoint == d.bgg_id){
        console.log("SAME")
      }
      return (window.selectedDataPoint == d.bgg_id ? "black" : "none");
    })
    .attr("stroke-width", d => (window.selectedDataPoint == d.bgg_id ? 5 : 0))
    .each(function(d) {
      if (window.selectedDataPoint == d.bgg_id) {
        d3.select(this).raise(); // Bring the selected circle to the front
      }
    });

  let x_axis = d3.axisBottom(xScale);

  g_x_axis_scatterplot
    .attr(
      "transform",
      "translate(" + margin.left + "," + (height - margin.bottom) + ")"
    )
    .call(x_axis);

  let y_axis = d3.axisLeft(yScale);

  g_y_axis_scatterplot
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(y_axis);

  let x_label = g_scatterplot.selectAll(".x_label").data(["AVG Rating"]);

  x_label
    .enter()
    .append("text")
    .attr("class", "x_label")
    .merge(x_label)
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "middle")
    .text((d) => d);

  x_label.exit().remove();

  let y_label = g_scatterplot.selectAll(".y_label").data(["Year"]);

  y_label
    .enter()
    .append("text")
    .attr("class", "y_label")
    .merge(y_label)
    .attr("x", -height / 2)
    .attr("y", margin.left / 4)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text((d) => d);

  y_label.exit().remove();
}
