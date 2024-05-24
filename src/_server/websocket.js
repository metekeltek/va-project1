//import * as csv from "csv-parser"
import { parse } from "csv-parse";
import * as fs from "fs"
import { print_clientConnected, print_clientDisconnected } from "./static/utils.js"
// const preprocessing = require("./preprocessing.js")
import { is_below_max_weight, parse_numbers, calc_bmi } from "./preprocessing.js"
import { getExampleLDA, getLDA } from "./druidExample.js";
import boardgames_100 from '../../data/boardgames_100.json' assert { type: 'json' };

const file_path = "data/"
const file_name = "example_data.csv"

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
      data: boardgames_100,
    })
    
    console.log(`freshData emitted`)
  })


  socket.on("getLDAData", (selectedClass) => {
    let lda = getLDA(boardgames_100, selectedClass.class);

    socket.emit("freshLDAData", {
      data: boardgames_100,
      lda: lda,
    })
    
    console.log(`freshLDAData emitted`)
  })
}