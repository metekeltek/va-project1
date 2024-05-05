import * as d3 from "d3";

export function draw_linechart(data) {

  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };

  /**
   * Selection of svg and groups to be drawn on.
   */
  let svg = d3.select("#chart_svg");
  let g_linechart = d3.select("#g_chart");
  let g_x_axis_linechart = d3.select("#g_x_axis_chart");
  let g_y_axis_linechart = d3.select("#g_y_axis_chart");

  /**
   * Getting the current width/height of the whole drawing pane.
   */
  let width = parseInt(svg.style("width"));
  let height = parseInt(svg.style("height"));

  console.log(width)

  /**
   * Scale function for the x-axis
   */
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
    .range([0, width - margin.left - margin.right]);

  /**
   * Scale function for the y-axis
   */
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Math.max(d.averageMaxPlaytime, d.averageMinPlaytime))])
    .range([height - margin.top - margin.bottom, 0]);

  /**
   * Drawing the line for averageMaxPlaytime
   */
  let maxPlaytimeLine = d3.line()
    .x((d) => margin.left + xScale(d.year))
    .y((d) => yScale(d.averageMaxPlaytime) + margin.top);

  /**
   * Drawing the line for averageMinPlaytime
   */
  let minPlaytimeLine = d3.line()
    .x((d) => margin.left + xScale(d.year))
    .y((d) => yScale(d.averageMinPlaytime) + margin.top);

  g_linechart.selectAll("path").remove();

  // Append the path for averageMaxPlaytime line
  g_linechart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", maxPlaytimeLine);

  // Append the path for averageMinPlaytime line
  g_linechart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)
    .attr("d", minPlaytimeLine);

  /**
   * Drawing the data points for averageMaxPlaytime as dots
   */
  let maxPoints = g_linechart.selectAll(".max-point").data(data);

  maxPoints.enter()
    .append("circle")
    .attr("class", "max-point")
    .merge(maxPoints)
    .attr("cx", (d) => margin.left + xScale(d.year))
    .attr("cy", (d) => yScale(d.averageMaxPlaytime) + margin.top)
    .attr("r", 4)
    .attr("fill", "steelblue");

  maxPoints.exit().remove();

  /**
   * Drawing the data points for averageMinPlaytime as dots
   */
  let minPoints = g_linechart.selectAll(".min-point").data(data);

  minPoints.enter()
    .append("circle")
    .attr("class", "min-point")
    .merge(minPoints)
    .attr("cx", (d) => margin.left + xScale(d.year))
    .attr("cy", (d) => yScale(d.averageMinPlaytime) + margin.top)
    .attr("r", 4)
    .attr("fill", "orange");

  minPoints.exit().remove();

  /**
   * Drawing the x-axis for the visualized data
   */
  let x_axis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  g_x_axis_linechart
    .attr(
      "transform",
      "translate(" + margin.left + "," + (height - margin.bottom) + ")"
    )
    .call(x_axis);

  /**
   * Drawing the y-axis for the visualized data
   */
  let y_axis = d3.axisLeft(yScale);

  g_y_axis_linechart
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(y_axis);

  /**
   * Drawing the x-axis label
   */
  let x_label = g_linechart.selectAll(".x_label").data(["Year"]);

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

  /**
   * Drawing the y-axis label
   */
  let y_label = g_linechart.selectAll(".y_label").data(["Average Playtime"]);

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