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
  //you likely want to preprocess the data and load it in from the server.
  let numberData = extractAttributes(boardgames_100, selectedClass)
  let classes = extractClasses(boardgames_100, selectedClass)

  // console.log("numberData"+ numberData)
  // console.log("classes" + classes)

  const X = druid.Matrix.from(numberData); // X is the data as object of the Matrix class.

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }) //2 dimensions, can use more.

  const result = reductionLDA.transform()
  // console.log("result: " + JSON.stringify(result).data)
  // console.log(result.to2dArray)

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
  console.log("DRAW" + selectedClass)
  let extractedData = [];

  originalData.forEach(boardgame => {

      let extractedAttributes = []
      switch(selectedClass) {
        case "year":
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.minplaytime);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
        case "minplayers":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.minplaytime);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
        case "maxplayers":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.minplaytime);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
        case "minage":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minplaytime);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
        case "minplaytime":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
        case "maxplaytime":
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.minplaytime);
          break;
        default:
          extractedAttributes.push(boardgame.year);
          extractedAttributes.push(boardgame.rank);
          extractedAttributes.push(boardgame.minplayers);
          extractedAttributes.push(boardgame.maxplayers);
          extractedAttributes.push(boardgame.minage);
          extractedAttributes.push(boardgame.minplaytime);
          extractedAttributes.push(boardgame.maxplaytime);
          break;
      }

      extractedData.push(extractedAttributes);
  });

  console.log("EXTRACT DIS SHIT NOW:" + extractedData)


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
        extractedClasses.push(boardgame.minplayers);
        break;
      case "maxplayers":
        extractedClasses.push(boardgame.maxplayers);
        break;
      case "minage":
        extractedClasses.push(boardgame.minage);
        break;
      case "minplaytime":
        extractedClasses.push(boardgame.minplaytime);
        break;
      case "maxplaytime":
        extractedClasses.push(boardgame.maxplaytime);
        break;
      default:
        // let categories = []
        // boardgame.types.categories.forEach(categorie => {
        //   categories.push({
        //     name: categorie.name,
        //   })
        // });
        extractedClasses.push(boardgame.types.categories[0].name);
        break;
    }
  });

  return extractedClasses;
}
