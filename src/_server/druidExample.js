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

  const result = reductionLDA.transform()

  console.log(result.to2dArray) //convenience method: https://saehm.github.io/DruidJS/Matrix.html
};


export function getLDA(boardgames_100, selectedClass) {
  let numberData = extractAttributes(boardgames_100, selectedClass)
  let classes = extractClasses(boardgames_100, selectedClass)

  const X = druid.Matrix.from(numberData);

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }) //2 dimensions, can use more.

  const result = reductionLDA.transform()
  const result2 = [];
  result.to2dArray.forEach((ldaEntry, index) => {
    result2.push({
      x: ldaEntry[0],
      y: ldaEntry[1],
      class: classes[index]
    });
  });

  return result2;
};

function extractAttributes(originalData, selectedClass) {
  let extractedData = [];

  originalData.forEach(boardgame => {

      let extractedAttributes = []
      switch(selectedClass) {
        case "year":
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.min_time);
          extractedAttributes.push(boardgame.max_time);
          break;
        case "minplayers":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.min_time);
          extractedAttributes.push(boardgame.max_time);
          break;
        case "maxplayers":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.min_time);
          extractedAttributes.push(boardgame.max_time);
          break;
        case "minage":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_time);
          extractedAttributes.push(boardgame.max_time);
          break;
        case "minplaytime":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.max_time);
          break;
        case "maxplaytime":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.min_time);
          break;
        default:
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.min_players);
          extractedAttributes.push(boardgame.max_players);
          extractedAttributes.push(boardgame.min_age);
          extractedAttributes.push(boardgame.min_time);
          extractedAttributes.push(boardgame.max_time);
          break;
      }

      extractedData.push(extractedAttributes);
  });

  return extractedData;
}

function extractClasses(originalData, selectedClass) {
  let extractedClasses = [];

  originalData.forEach(boardgame => {
    switch(selectedClass) {
      case "year":
        extractedClasses.push(boardgame.year);
        break;
      case "minplayers":
        extractedClasses.push(boardgame.min_players);
        break;
      case "maxplayers":
        extractedClasses.push(boardgame.max_players);
        break;
      case "minage":
        extractedClasses.push(boardgame.min_age);
        break;
      case "minplaytime":
        extractedClasses.push(boardgame.min_time);
        break;
      case "maxplaytime":
        extractedClasses.push(boardgame.max_time);
        break;
      default:
        extractedClasses.push(boardgame.category.split(',')[0]);
        break;
    }
  });

  return extractedClasses;
}
