import * as druid from "@saehrimnir/druidjs";
import { count } from "d3";

export function getExampleLDA() {
  //you likely want to preprocess the data and load it in from the server.
  let numberData = [
    [2017, 1, 1, 4, 60],
    [1, 2, 3, 24, 5],
    [1, 24, 3, 4, 2],
    [1, 2, 36, 5, 5],
    [1, 21, 3, 4, 5],
    [102, 2, 3, 7, 5]
  ]

  // let classes = extractClasses(numberData)

  let classes = ["1", "1", "2", "2", "1", "1"]

  const X = druid.Matrix.from(numberData); // X is the data as object of the Matrix class.

  // console.log("X:" + JSON.stringify(X))

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 1 }) //2 dimensions, can use more.

  console.log("reductionLDA:" + JSON.stringify(reductionLDA))

  const result = reductionLDA.transform()

  console.log(result.to2dArray) //convenience method: https://saehm.github.io/DruidJS/Matrix.html
};


export function getLDA(boardgames_100) {
  //you likely want to preprocess the data and load it in from the server.
  let numberData = extractAttributes(boardgames_100)
  let classes = extractClasses(boardgames_100)

  const X = druid.Matrix.from(numberData); // X is the data as object of the Matrix class.

  // console.log("X:" + JSON.stringify(X))

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }) //2 dimensions, can use more.
  // console.log("before error")
  // console.log("reductionLDA:" + JSON.stringify(reductionLDA))
  // console.log("still before error")

  const result = reductionLDA.transform()
  console.log("after error")
  console.log(result.to2dArray)

};

function extractAttributes(originalData) {
  let extractedData = [];

  originalData.forEach(boardgame => {
      let extractedAttributes = [
          boardgame.year,
          boardgame.rank,
          boardgame.minplayers,
          boardgame.minplaytime,
          boardgame.maxplaytime,
          boardgame.minage
      ];

      extractedData.push(extractedAttributes);
  });

  return extractedData;
}

function extractClasses(originalData) {
  let extractedClasses = [];

  originalData.forEach(boardgame => {
    extractedClasses.push(boardgame.maxplayers);
  });

  return extractedClasses;
}
