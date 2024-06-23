import * as d3 from "d3"

export function draw_cluster_scatterplot(data) {
  console.log("TEST2")


  let svg = d3.select('#chart_svg').selectAll("*").remove();

  /**
   * Margins of the visualization.
   */
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 130,
  }
  /**
   * Selection of svg and groups to be drawn on.
   */
  svg = d3.select("#chart_svg")
  svg.append("g").attr("id", "g_chart");
  svg.append("g").attr("id", "g_x_axis_chart");
  svg.append("g").attr("id", "g_y_axis_chart");
  let g_scatterplot = d3.select("#g_chart")
  let g_x_axis_scatterplot = d3.select("#g_x_axis_chart")
  let g_y_axis_scatterplot = d3.select("#g_y_axis_chart")

  console.log("TEST7")
  /**
   * Getting the current width/height of the whole drawing pane.
   */
  let width = parseInt(svg.style("width"))
  let height = parseInt(svg.style("height"))
  console.log("TEST8")

  // Scale function for the x-axis

  console.log("HEREEEE")
  console.log(data[0].dataPoint)

  console.log(data)
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.dataPoint[0])), d3.max(data.map((d) => d.dataPoint[0]))])
    .range([0, width - margin.left - margin.right]);

    console.log("TEST9")

  // Scale function for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data.map((d) => d.dataPoint[1])), d3.max(data.map((d) => d.dataPoint[1]))])
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
    .attr("fill", (d) => colorScale(d.centroidIndex))
    .attr("r", 5)
    .attr("cx", (d) => margin.left + xScale(d.dataPoint[0]))
    .attr("cy", (d) => yScale(d.dataPoint[1]) + margin.top);

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
  let y_axis = d3.axisLeft(yScale);
  // let y_axis = d3.axisLeft(yScale).tickFormat(d3.format(".0f"));

  g_y_axis_scatterplot
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(y_axis);

  // Drawing the x-axis label
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

  // Drawing the y-axis label
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

  // const legend = svg.append("g")
  // .attr("class", "legend");

// const legendRectSize = 18;
// const legendSpacing = 4;

// const legendItems = legend.selectAll(".legendItem")
//   .data(colorScale.domain())
//   .enter()
//   .append("g")
//   .attr("class", "legendItem")
//   .attr("transform", function(d, i) {
//     const height = legendRectSize + legendSpacing;
//     const horz = width - 210;
//     const vert = margin.top + i * height; // Adjust vertical position
//     return "translate(" + horz + "," + vert + ")";
//   });

// legendItems.append("rect")
//   .attr("width", legendRectSize)
//   .attr("height", legendRectSize)
//   .style("fill", colorScale);

// legendItems.append("text")
//   .attr("x", legendRectSize + legendSpacing)
//   .attr("y", legendRectSize - legendSpacing)
//   .text(function(d) { return d; });

// // Calculate legend height
// const legendHeight = colorScale.domain().length * (legendRectSize + legendSpacing);
// legend.attr("transform", "translate(0," + (margin.top) + ")"); // Mount legend to the top

}