import * as druid from "@saehrimnir/druidjs";
import { count } from "d3";

export function getExampleLDA() {
  let numberData = [
    [2017, 1, 1, 4, 60],
    [1, 2, 3, 24, 5],
    [1, 24, 3, 4, 2],
    [1, 2, 36, 5, 5],
    [1, 21, 3, 4, 5],
    [102, 2, 3, 7, 5]
  ]
  let classes = ["1", "1", "2", "2", "1", "1"]

  const X = druid.Matrix.from(numberData);

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

  console.log("numberData"+ numberData)
  console.log("classes" + classes)

  const X = druid.Matrix.from(numberData); // X is the data as object of the Matrix class.

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 1 }) //2 dimensions, can use more.

  const result = reductionLDA.transform()
  console.log("result: " + JSON.stringify(result).data)
  console.log(result.to2dArray)

  const result2 = [];
  result.to2dArray.forEach((ldaEntry, index) => {
    result2.push({
      x: classes[index],
      y: ldaEntry[0],
      class: classes[index]
  });
  });

  return result2;
};

function extractAttributes(originalData) {
  let extractedData = [];

  originalData.forEach(boardgame => {
      let extractedAttributes = [
          boardgame.year,
          boardgame.maxplayers,
          boardgame.minage,
          boardgame.maxplaytime,
      ];

      extractedData.push(extractedAttributes);
  });

  return extractedData;
}

function extractClasses(originalData) {
  let extractedClasses = [];

  originalData.forEach(boardgame => {
    extractedClasses.push(boardgame.minplaytime);
  });

  return extractedClasses;
}
