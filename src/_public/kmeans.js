
//Implementation of a multidimensional k-means algorithm. Assumes that all values are numerical and between 0 and 1. 
//Uses a modified euclidiant distance where seperate dimensions get scales according to user-set preferences


export function getNewKMeans(dataPointsToCluster, clusteringObj) {
    console.log("now: " + clusteringObj.selectedDistance)
    console.log("now: " + JSON.stringify(dataPointsToCluster))
    console.log("now: " + clusteringObj)
    let contributionPerVariable = [0.5,0.5];
    let k = clusteringObj.selectedK;

    let result = kMeans(dataPointsToCluster, k, contributionPerVariable, clusteringObj.selectedDistance)
    return result
}


/**
 * 
 * @param {[number][]} dataPointsToCluster The data points. Each data point should have the same number of dimensions and have values between 0 and 1
 * @param {number} k amount of clusters
 * @param {[number]} contributionPerVariable containing the percentage contribution per variable
 * @returns {{centroids: [number][], dataPoints: {variableValues:[number],centroidIndex:number}[]}} the {k} cluster centroids and the assignment of data to centroid
 */
export function kMeans(dataPointsToCluster, k, contributionPerVariable, distanceMeasure) {

    //Add the required fields to the object
    let dataObjects = dataPointsToCluster.map(item => {
        return { dataPoint: item.dataPoint, centroidIndex: 0, bgg_id: item.bgg_id };
    })
    //initialize with random centroids
    let centroids = getRandomCentroids(dataObjects, k);
    let hasChanged = true;

    //iteratively move the centroids of the clusters closer to the center of their cluster center 
    while (hasChanged) {
        dataObjects = assignDatapointsToCentroids(dataObjects, centroids, contributionPerVariable, distanceMeasure);
        const result = calculateNewCentroids(dataObjects, centroids, contributionPerVariable);
        centroids = result.centroids;
        hasChanged = result.centroidsChanged;
    }
    return dataObjects;
}

/**
 * Calculates the mean values for the given data points.
 * @param {[number][]} dataPoints The data points we are averaging over. Each data point should have the same number of dimensions
 * @returns {[number]} The mean value
 */
function mean(dataPoints) {
    let meanOfValues = new Array(dataPoints[0].length).fill(0);
    //Add the contribution to the mean for each point
    for (let dataPoint of dataPoints) {
        for (let j = 0; j < dataPoint.length; j++) {
            meanOfValues[j] += dataPoint[j] / dataPoints.length; //normalize contribution
        }
    }
    return meanOfValues;
}

/**
 * Returns the modified euclidian distance between the two datapoints taking the contibution per variable into account.
 * @param {number[]} dataPoint1  Array containing the values of each variable
 * @param {number[]} dataPoint2  Array containing the values of each variable
 * @param {[number]} contributionPerVariable containing the percentage contribution per variable
 */
function distanceEuclidianContribution(dataPoint1, dataPoint2, contributionPerVariable) {
    let sumDistance = 0;
    for (let i = 0; i < dataPoint1.length; i++) {
        sumDistance += Math.pow(dataPoint1[i] - dataPoint2[i],2) * contributionPerVariable[i];
    }
    return Math.sqrt(sumDistance);
}

function distanceManhattanContribution(dataPoint1, dataPoint2, contributionPerVariable) {
    let sumDistance = 0;
    for (let i = 0; i < dataPoint1.length; i++) {
        sumDistance += Math.abs(dataPoint1[i] - dataPoint2[i]) * contributionPerVariable[i];
    }
    return sumDistance;
}

function distanceChebyshevContribution(dataPoint1, dataPoint2, contributionPerVariable) {
    let maxDistance = 0;
    for (let i = 0; i < dataPoint1.length; i++) {
        let currentDistance = Math.abs(dataPoint1[i] - dataPoint2[i]) * contributionPerVariable[i];
        if (currentDistance > maxDistance) {
            maxDistance = currentDistance;
        }
    }
    return maxDistance;
}


/**
 * Assigns each data point according to the given distance function to the nearest centroid.
 *
 * @param {{dataPoint:[number],centroidIndex:number}[]} dataObjects
 * @param {[number][]} centroids The current centroids.
 * @param {[number]} contributionPerVariable containing the percentage contribution per variable
 * @returns {{dataPoint:[number],centroidIndex:number}[]} An updated mapping of the datapoints
 */
function assignDatapointsToCentroids(
    dataObjects,
    centroids,
    contributionPerVariable,
    distanceMeasure
) {
    return dataObjects.map(dataObject => {
        let minDistance = Infinity;
        let centroidIndex = -1;
        //Find the new centroid
        centroids.forEach((centroid, index) => {
            // use distanceManhattanContribution or distanceEuclidianContribution or distanceChebyshevContribution
            let distance;
            if(distanceMeasure == "Manhattan"){
                distance = distanceManhattanContribution(dataObject.dataPoint, centroid, contributionPerVariable);
            }else if(distanceMeasure == "Euclidian"){
                distance = distanceEuclidianContribution(dataObject.dataPoint, centroid, contributionPerVariable);
            }else{
                distance = distanceChebyshevContribution(dataObject.dataPoint, centroid, contributionPerVariable);
            }
            
            
            if (distance < minDistance) {
                minDistance = distance;
                centroidIndex = index;
            }
        });
        return { dataPoint: dataObject.dataPoint, centroidIndex: centroidIndex, bgg_id:dataObject.bgg_id  }; //add it to the mapping
    });
}


/**
 * Calculates for each centroid it's new position according to the given measure.
 *
 * @param {{dataPoint:[number],centroidIndex:number}[]} dataObjects 
 * @param {[number][]} centroids The current centroids.
 * @returns {{centroids: [number][],centroidsChange: boolean}} The new location of the centroids and whether at least 1 moved.
 */
function calculateNewCentroids(dataObjects, centroids) {
    let centroidsChanged = false;

    let newCentroids = centroids.map((centroid, centroidIndex) => {
        //grab all associated points
        const associatedPoints = dataObjects.filter(dataObject => dataObject.centroidIndex === centroidIndex).map(dataObject => dataObject.dataPoint)
        if (associatedPoints.length === 0) {
            return centroid;
        }
        //calculate the new centroid.
        const newCentroid = mean(associatedPoints);
        
        for (let i = 0; i < newCentroid.length; i++) {
            if (newCentroid[i] !== centroid[i]) {
                centroidsChanged = true; //at least 1 of the centroids moved.
            }
        }

        return newCentroid;
    });
    return { centroids: newCentroids, centroidsChanged };
}

/**
 * Generates random centroids according to the amount of variables in {dataObjects} and the specified {k}.
 *
 * @param {{dataPoint:[number],centroidIndex:number}[]} dataObjects 
 * @param {Number} k - number of centroids to be generated
 * @param {[number][]} centroids Generated centroids.
 */
function getRandomCentroids(dataObjects, k) {
    let centroids = [];

    for (let kIndex = 0; kIndex < k; kIndex++) {
        let dimensionCount = dataObjects[0].dataPoint.length
        let centroid = [];
        for (let i = 0; i < dimensionCount; i++) {
            centroid[i] = Math.random();
        }
        centroids[kIndex] = centroid
    }
    return centroids;
}