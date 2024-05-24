import io from "socket.io-client"
import "./app.css"
import {configs} from "../_server/static/configs.js"
import {draw_barchart} from "./barchart.js"
import {draw_scatterplot} from "./scatterplot.js"
import * as d3 from "d3"
import { draw_linechart } from "./linechart.js"

let hostname = window.location.hostname
let protocol = window.location.protocol
const socketUrl = protocol + "//" + hostname + ":" + configs.port

export const socket = io(socketUrl)
socket.on("connect", () => {
  console.log("Connected to " + socketUrl + ".")
})
socket.on("disconnect", () => {
  console.log("Disconnected from " + socketUrl + ".")
})

let requestData = () => {
  console.log(`requesting data from webserver (every 2sec)`)

  socket.emit("getData")
}

let requestLDAData = (selectedClass) => {
  console.log(`requesting data from webserver (every 2sec)`)

  socket.emit("getLDAData", {
    class: selectedClass,
  })
}

/**
 * Assigning the callback to request the data on click.
 */
document.getElementById("load_data_button").onclick = () => {
  requestData()
}

document.getElementById("load_LDA_button").onclick = () => {
  var selectedOption = document.querySelector('input[name="attribute"]:checked');
  requestLDAData(selectedOption.value)
}



/**
 * Object, that will store the loaded data.
 */
let data = {
  barchart: undefined,
  scatterplot: undefined,
}

let handleData = (payload) => {
  const yearData = {};
  payload.data.forEach(game => {
    const year = game.year;
    const maxPlaytime = game.maxplaytime;
    const minPlaytime = game.minplaytime;

    if (!yearData[year]) {
      yearData[year] = {
        totalMaxPlaytime: 0,
        totalMinPlaytime: 0,
        count: 0
      };
    }
    yearData[year].totalMaxPlaytime += maxPlaytime;
    yearData[year].totalMinPlaytime += minPlaytime;
    yearData[year].count++;
  });

  const averagePlaytimeByYear = Object.keys(yearData).map(year => ({
    year: parseInt(year),
    averageMaxPlaytime: yearData[year].totalMaxPlaytime / yearData[year].count,
    averageMinPlaytime: yearData[year].totalMinPlaytime / yearData[year].count
  }));

  draw_linechart(averagePlaytimeByYear)
}

let handleLDAData = (payload) => {
  draw_scatterplot(payload.lda, payload.selectedClass)
}

socket.on("freshData", handleData)
socket.on("freshLDAData", handleLDAData)


let width = 0
let height = 0

/**
 * This is an example for visualizations, that are not automatically scalled with the viewBox attribute.
 *
 * IMPORTANT:
 * The called function to draw the data must not do any data preprocessing!
 * To much computational load will result in stuttering and reduced responsiveness!
 */
let checkSize = setInterval(() => {
  let container = d3.select(".visualizations")
  let newWidth = parseInt(container.style("width"))
  let newHeight = parseInt(container.style("height"))
  if (newWidth !== width || newHeight !== height) {
    width = newWidth
    height = newHeight
    if (data.scatterplot) draw_scatterplot(data.scatterplot)
  }
}, 100)
