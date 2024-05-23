import * as d3 from "d3"

export function draw_scatterplot(data) {
  console.log("draw scatterplot")
  console.log(data)

  /**
   * Margins of the visualization.
   */
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  }

  /**
   * Selection of svg and groups to be drawn on.
   */
  let svg = d3.select("#chart_svg")
  let g_scatterplot = d3.select("#g_chart")
  let g_x_axis_scatterplot = d3.select("#g_x_axis_chart")
  let g_y_axis_scatterplot = d3.select("#g_y_axis_chart")

  /**
   * Getting the current width/height of the whole drawing pane.
   */
  let width = parseInt(svg.style("width"))
  let height = parseInt(svg.style("height"))

  // Scale function for the x-axis
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.x)), d3.max(data.map((d) => d.x))])
    .range([0, width - margin.left - margin.right]);

  // Scale function for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.y)), d3.max(data.map((d) => d.y))])
    .range([height - margin.top - margin.bottom, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([...new Set(data.map(d => d.class))]);

  // Drawing the data itself as circles
  let scatterplot_circle = g_scatterplot
    .selectAll(".scatterplot_circle")
    .data(data);

  scatterplot_circle
    .enter()
    .append("circle")
    .attr("class", "scatterplot_circle")
    .merge(scatterplot_circle)
    .attr("fill", (d) => colorScale(d.class))
    .attr("r", 5)
    .attr("cx", (d) => margin.left + xScale(d.x))
    .attr("cy", (d) => yScale(d.y) + margin.top);

  scatterplot_circle.exit().remove();

  // Drawing the x-axis for the visualized data
  let x_axis = d3.axisBottom(xScale);

  g_x_axis_scatterplot
    .attr(
      "transform",
      "translate(" + margin.left + "," + (height - margin.bottom) + ")"
    )
    .call(x_axis);

  // Drawing the y-axis for the visualized data
  let y_axis = d3.axisLeft(yScale).tickFormat(d3.format(".0f"));

  g_y_axis_scatterplot
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(y_axis);

  // Drawing the x-axis label
  let x_label = g_scatterplot.selectAll(".x_label").data(["X-Axis"]);

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

  // Drawing the y-axis label
  let y_label = g_scatterplot.selectAll(".y_label").data(["Y-Axis"]);

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