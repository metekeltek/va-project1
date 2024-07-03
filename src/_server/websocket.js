//import * as csv from "csv-parser"
import { parse } from "csv-parse";
import * as fs from "fs"
import { print_clientConnected, print_clientDisconnected } from "./static/utils.js"
// const preprocessing = require("./preprocessing.js")
import { is_below_max_weight, parse_numbers, calc_bmi } from "./preprocessing.js"
import { getExampleLDA, getLDA } from "./druidExample.js";
import boardgames_100 from '../../data/boardgames_100.json' assert { type: 'json' };
import boardgames_500 from '../../data/bgg_Gameitems500.json' assert { type: 'json' };
import boardgames_all from '../../data/bgg_Gameitems.json' assert { type: 'json' };
import recommendations from '../../data/recommendations.json' assert { type: 'json' };
import PageRank from "../_public/pagerank.js";

const file_path = "data/"
const file_name = "example_data.csv"

const pageRanks = calculatePageRanks(recommendations)
const preparedRecommendations = prepareRecommendations(pageRanks)
const chakalaka = prepareRecommendationsClustering(pageRanks, boardgames_all)

/**
 * Does some console.logs when a client connected.
 * Also sets up the listener, if the client disconnects.
 * @param {*} socket 
 */
export function setupConnection(socket) {
  print_clientConnected(socket.id)



  /**
   * Listener that is called, if client disconnects.
   */
  socket.on("disconnect", () => {
    print_clientDisconnected(socket.id)
  })

  /**
   * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
   * 
   * !!!!! Here an below, you can/should edit the code  !!!!!
   * - you can modify the getData listener
   * - you can add other listeners for other functionalities
   * 
   * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
   */

  socket.on("getData", () => {

    socket.emit("freshData", {
      data: chakalaka,
    })
    
    console.log(`freshData emitted`)
  })

  socket.on("getLDAData", (selectedClass) => {
    let lda = getLDA(chakalaka, selectedClass.class);

    socket.emit("freshLDAData", {
      lda: lda
    })
    
    console.log(`freshLDAData emitted`)
  })

  socket.on("getClusteringData", (obj) => {
    //console.log(chakalaka)
    console.log("chakalaka.length:" + chakalaka.length)

    socket.emit("freshClusteringData", {
      data: chakalaka,
      clusterObj: obj.clusterObj
    })
    
    console.log(`fresh Clustetring Data emitted:` + JSON.stringify(obj.clusterObj))
  })

  socket.on("getGraphData", () => {

    //console.log(preparedRecommendations)
    console.log("preparedRecommendations.length:" + preparedRecommendations.length)

    socket.emit("freshGraphData", {
      data: preparedRecommendations,
    })
    
    console.log(`freshGraphData emitted`)
  })
}

function prepareRecommendationsClustering(data, boardgames_all){
    // Filter to keep only top 100 games by PageRank
    const top100Games = data.sort((a, b) => b.pageRank - a.pageRank).slice(0, 500);
    const top100Ids = new Set(top100Games.map(game => game.id));

    return boardgames_all
    .filter(game => top100Ids.has(game.bgg_id.toString()))
    .filter(game => game["year"] > 1880)
    .map(game => {
      return {
        ...game,
      };
    });
}


function prepareRecommendations(data){
    // Filter to keep only top 100 games by PageRank
    const top100Games = data.sort((a, b) => b.pageRank - a.pageRank).slice(0, 100);
    const top100Ids = new Set(top100Games.map(game => game.id));

    // Remove recommendations to games not in the top 100
    const filteredData = top100Games.map(game => {
      return {
        ...game,
        recommendations: game.recommendations.filter(rec => top100Ids.has(rec))
      };
    });

    return filteredData;
}


function calculatePageRanks(rawData){
  const validIds = new Set(rawData.map(game => game.ID.toString()));

  // remove unused Rows and cleanup
  let data = rawData.map(game => {
    let recommendations = [];
    for (let i = 1; i <= 28; i++) {
      var key = 'recommendation' + i;
      if (game[key] && validIds.has(game[key].toString())) {
        recommendations.push(game[key].toString());
      }
    }
    return {
      id: game.ID.toString(),
      name: game.Name,
      recommendations: recommendations
    };
  });

    // Create a mapping from id to index
    let idToIndex = {};
    data.forEach((d, i) => {
      idToIndex[d.id] = i;
    });
  
    // Initialize PageRank object and add links
    let pr = PageRank;
    data.forEach(d => {
      d.recommendations.forEach(rec => {
        pr.link(d.id, rec);
      });
    });
  
    // Calculate PageRank scores
    const pagerankScores = {};
    pr.rank(0.85, 0.000001, (node, rank) => {
      pagerankScores[node] = rank;
    });
  
    // Add PageRank scores to the data
    data.forEach(d => {
      d.pageRank = pagerankScores[d.id];
    });

    return data;
}