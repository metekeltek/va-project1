import io from "socket.io-client"
import "./app.css"
import {configs} from "../_server/static/configs.js"
import {draw_scatterplot} from "./scatterplot.js"
import * as d3 from "d3"
import { draw_linechart } from "./linechart.js"
import { draw_cluster_scatterplot } from "./clusterScatterplot.js"
import { getNewKMeans } from "./kmeans.js"
import { draw_graph } from "./graph.js"

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

let requestClusteringData = (clusterObj) => {
  console.log(`requesting data from webserver (every 2sec) :`+ clusterObj.selectedK)


  socket.emit("getClusteringData", {
    clusterObj: clusterObj,
  })
}

let requestLDAData = (selectedClass) => {
  console.log(`requesting data from webserver (every 2sec)`)

  socket.emit("getLDAData", {
    class: selectedClass,
  })
}

let requestGraphData = () => {
  console.log(`requesting data from webserver (every 2sec)`)

  socket.emit("getGraphData")
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

document.getElementById("load_graph").onclick = () => {
  requestGraphData()
}


document.getElementById("load_clustering_button").onclick = () => {
  var selectedOption = document.querySelector('input[name="distance"]:checked');
  var selectedInteger = document.querySelector('input[name="k"]');

  let clusterObj = {
    selectedDistance: selectedOption.value,
    selectedK: selectedInteger.value
  }
  requestClusteringData(clusterObj)
}





/**
 * Object, that will store the loaded data.
 */
let data = {
  scatterplot: undefined,
}

let removeOutlier = (payload) => {
  let games = []

  console.log(games.length)
  payload.data.forEach(game => {
    if(game.avg_rating && game.min_time && game.year > 1950 && game.avg_rating > 4.0){
      games.push(game)
    }
  });
  console.log(games.length)
  console.log(payload.data.length)

  return games
}

let handleClusteringData = (payload) => {
  console.log("HELLLLLLLOOOOOOOO???")
  const clusteringData = [];
  const clusteringDataAsArray = [];

  let games = removeOutlier(payload)

  let minRating = Math.min(...games.map(d => d.avg_rating));
  let maxRating = Math.max(...games.map(d => d.avg_rating));
  let minYear = Math.min(...games.map(d => d.year));
  let maxYear = Math.max(...games.map(d => d.year));


  games.forEach(game => {
      clusteringDataAsArray.push({
        dataPoint: [
          (game.avg_rating - minRating) / (maxRating - minRating),
          (game.year - minYear) / (maxYear - minYear)
        ],
        bgg_id: game.bgg_id
    })
  });
  console.log(clusteringDataAsArray)

  console.log("clusteringDataAsArray!")
  const result = getNewKMeans(clusteringDataAsArray, payload.clusterObj)

  console.log(result)
  
  draw_cluster_scatterplot(result)

}

let handleData = (payload) => {
  console.log("HELLLLLLLOOOOOOOO???")
  const yearData = {};
  payload.data.forEach(game => {
    const year = game.year;
    const maxPlaytime = game.max_time;
    const minPlaytime = game.min_time;

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
  console.log("HELLLLLLLOOOOOOOO???")
  draw_scatterplot(payload.lda)
}

let handleGraphData = (payload) => {
  console.log("HELLLLLLLOOOOOOOO???")
  console.log("payload.data: " + payload.data)
  draw_graph(payload.data)
}

socket.on("freshData", handleData)
socket.on("freshClusteringData", handleClusteringData)
socket.on("freshLDAData", handleLDAData)
socket.on("freshGraphData", handleGraphData)



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
