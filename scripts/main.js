/**
 * Created by Sandeep on 11/29/16.
 */
// reference link https://github.com/d-miller/correlation-scatter
/*

 r value =
 +.70 or higher	Very strong positive relationship
 +.40 to +.69	Strong positive relationship
 +.30 to +.39	Moderate positive relationship
 +.20 to +.29	weak positive relationship
 +.01 to +.19	No or negligible relationship
 0	No relationship [zero order correlation]
 -.01 to -.19	No or negligible relationship
 -.20 to -.29	weak negative relationship
 -.30 to -.39	Moderate negative relationship
 -.40 to -.69	Strong negative relationship
 -.70 or higher	Very strong negative relationship

 */

/* GlobalVarialbles */
var listOfXchanges = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemberv", "December"];
var marketCap = [];
var correlationMatrix = [];
var orderString = "";
var resultarray = [];
main();


/**
 *  @fileoverview Pearson correlation score algorithm.
 *  @author matt.west@kojilabs.com (Matt West)
 *  @license Copyright 2013 Matt West.
 *  Licensed under MIT (http://opensource.org/licenses/MIT).
 */


/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
function pearsonCorrelation(prefs, p1, p2) {
    var si = [];

    for (var key in prefs[p1]) {
        if (prefs[p2][key]) si.push(key);
    }

    var n = si.length;

    if (n == 0) return 0;

    var sum1 = 0;
    for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

    var sum2 = 0;
    for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

    var sum1Sq = 0;
    for (var i = 0; i < si.length; i++) {
        sum1Sq += Math.pow(prefs[p1][si[i]], 2);
    }

    var sum2Sq = 0;
    for (var i = 0; i < si.length; i++) {
        sum2Sq += Math.pow(prefs[p2][si[i]], 2);
    }

    var pSum = 0;
    for (var i = 0; i < si.length; i++) {
        pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
    }

    var num = pSum - (sum1 * sum2 / n);
    var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
        (sum2Sq - Math.pow(sum2, 2) / n));

    if (den == 0) return 0;

    return num / den;
}


function fetchData(dataCategory, dataRows) {
    // loop through all the rows in file
    console.log(" Reading file object for : " + dataCategory);
    for (var rowNumber = 0; rowNumber < dataRows.length; rowNumber++) {
        var record = dataRows[rowNumber];
        // make an object to store data for the current exchange
        var exchange = {
            name: record.Exchange,
            data: []
        };

        marketCap[record.Exchange] = {};
        // loop through all months, from Jan to Dec for specific Xchagne
        for (var i = 0; i < 12; i++) {
            var value = record[months[i]];

            // deal with missing data points
            if (value === '--') {
                value = 0;
            } else if (value === 'NA') {
                value = 0;
            } else if (value === '') {
                value = 0;
            } else if (value === ' ') {
                value = 0;
            } else if (value === undefined || value === null) {
                value = 0;
            }

            // add data
            exchange.data.push(value);
        }


        if (listOfXchanges.indexOf(record.Exchange) === -1)
            listOfXchanges.push(record.Exchange); // add exchange to list of Xchange


        marketCap[exchange.name].data = exchange.data;
        console.log("Gotcha: " + dataCategory + " :" + marketCap[exchange.name]);

    }

    //listOfXchanges.sort();

    //  console.log("Gotcha: "+ dataCategory+" :"+ marketCap.ex );

}


function buildCorrelationMatrix() {
    var dataArr = [];

    for (i = 0; i < listOfXchanges.length; i++) {
        correlationMatrix[i] = [];
        dataArr[0] = marketCap[listOfXchanges[i]].data;
        for (j = 0; j < listOfXchanges.length; j++) {
            dataArr[1] = marketCap[listOfXchanges[j]].data;
            correlationMatrix[i][j] = pearsonCorrelation(dataArr, 0, 1);
            //correlationMatrix[i][j] = getPCC(dataArr[0],dataArr[1]);
        }
        if (correlationMatrix[i][i] == 0) {
            correlationMatrix[i][i] = 1;
        }
    }


}

function doStuff(url, dataCategory, dataRows) {
    fetchData(dataCategory, dataRows);
    buildCorrelationMatrix();
    plotGraph();
}



function parseData(url, dataCategory, callBack) {


    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        header: true,
        complete: function(results) {
            callBack(url, dataCategory, results.data);
        }
    });

}



function main() {


    // read file for various categories ( lets read one for the moment )
    parseData("data/2010MarketCap.csv", "Market Capitalization", doStuff);

    // get exchanges
    // find pcc
    // send data to patric's viz


}



function plotGraph() {

    var margin = {
            top: 30,
            right: 0,
            bottom: 10,
            left: 60
        },
        width = 900,
        height = 900;
    var gridSize = Math.floor(width / 9 * 0.14);
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];

    var svg = d3.select("#matrix").append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", -margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* var colorScale = d3.scale.quantile()
         .domain([-1, 1])
         .range(colors); */

    var colorScale = d3.scale.linear().domain([1, 0, -1]).range(["#4d9221", "#f7f7f7", "#c51b7d"]);

    var max = -2,
        maxi = 0,
        maxj = 0;

    var t = d3.transition()
        .duration(750);

    var order = [];
    var clusters = clusterfck.hcluster(correlationMatrix);
    console.log(clusters);
    var tempclust = clusters;
    traverse(tempclust);

    for (i = 0; i < listOfXchanges.length; i++) {
        if (listOfXchanges[i] == 'Muscat Securities Market') {
            console.log(i);
        }
    }

    console.log(correlationMatrix[45]);

    function traverse(tempclust) {
        if (tempclust.size == 1) {
            for (i = 0; i < listOfXchanges.length; i++) {
                if (tempclust.value[i] == 1) {
                    console.log(listOfXchanges[i] + " " + i);
                    order.push(listOfXchanges[i]);
                    break;
                }
            }
        } else {
            traverse(tempclust.left);
            traverse(tempclust.right);
        }
    }

    DrawMatrix(correlationMatrix, t, gridSize);
    Drawaxis(listOfXchanges, t, gridSize);

    d3.select("#order")
        .on("click", function(d) {
            Cluster(listOfXchanges, orderString, correlationMatrix, order);
        });

    function Cluster(listOfXchanges, orderString, correlationMatrix, order) {
        //var order = clusterXchange[0].split(",");
        var tempindex = 0,
            tempname = "",
            newindex = 0;
        for (var g = 0; g < listOfXchanges.length; g++) {
            tempname = order[g];
            tempindex = listOfXchanges.indexOf(tempname);
            newindex = g;
            if (tempindex != newindex) {
                Order(listOfXchanges, correlationMatrix, tempindex, newindex);
            }
        }
        Drawaxis(listOfXchanges, t, gridSize);
        DrawMatrix(correlationMatrix, t, gridSize);

    }

    function Order(list, correlationMatrix, tempindex, newindex) {
        var temp = "",
            tempnum = 0;
        temp = list[newindex];
        list[newindex] = list[tempindex];
        list[tempindex] = temp;
        var temparr = correlationMatrix[tempindex];
        correlationMatrix[tempindex] = correlationMatrix[newindex];
        correlationMatrix[newindex] = temparr;
        for (j = 0; j < list.length; j++) {
            tempnum = correlationMatrix[j][newindex];
            correlationMatrix[j][newindex] = correlationMatrix[j][tempindex];
            correlationMatrix[j][tempindex] = tempnum;
        }
    }

    function Drawaxis(listOfXchanges, t, gridSize) {
        svg.selectAll(".yAxis").remove();
        svg.selectAll(".xAxis").remove();

        var y = d3.scale.ordinal()
            .domain(listOfXchanges)
            .rangePoints([gridSize / 2, (height * 0.89) - gridSize / 2]);
        var x = d3.scale.ordinal()
            .domain(listOfXchanges)
            .rangePoints([gridSize / 2, (width * 0.89) - gridSize / 2]);
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");
        svg.append("g") // Add the X Axis
            .attr("class", "xAxis")
            .attr("transform", "translate(130,60)")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 2)
            //.attr("dy", ".25em")
            .attr("transform", "translate(21,10) rotate(-90)")
            .style("text-anchor", "start")
            .style("font-size", "8px");
        svg.append("g") // Add the X Axis
            .attr("class", "yAxis")
            .attr("transform", "translate(80,55)")
            .call(yAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 0)
            //.attr("dy", ".25em")
            .attr("transform", "translate(65,14)")
            .style("text-anchor", "end")
            .style("font-size", "8px");
            drawLegend();

    }

    function DrawMatrix(correlationMatrix, t, gridSize) {
        svg.selectAll(".tiles").remove();

        svg.selectAll("rect")
            .data(correlationMatrix)
            .enter()
            .append("g")
            .selectAll("rect")
            .data(function(d, i) {
                return d;
            })
            .enter()
            .append("rect")
            .transition(t)
            .attr("x", function(d, i) {
                return i * gridSize + 150;
            })
            .attr("y", function(d, i, j) {
                return j * gridSize + 70;
            })
            //.attr("rx", 2)
            //.attr("ry", 2)
            .attr("class", "tiles")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function(d, i) {
                return colorScale(d);
            });

        svg.selectAll("rect")
            .on("click", hovered)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    }

    function drawLegend(){
      var w = 340, h = 400;

			var key = d3.select("#legend").attr("width", w+25).attr("height", h);
      var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%").attr("spreadMethod", "pad");
      legend.append("stop").attr("offset", "0%").attr("stop-color", "#c51b7d").attr("stop-opacity", 1);
      legend.append("stop").attr("offset", "50%").attr("stop-color", "#ffffff").attr("stop-opacity", 1);
			legend.append("stop").attr("offset", "100%").attr("stop-color", "#4d9221").attr("stop-opacity", 1);
      key.append("rect").attr("width", w).attr("height", 40).style("fill", "url(#gradient)").attr("transform", "translate(10,100)");

			var x = d3.scale.linear().range([340, 0]).domain([1, -1]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");

			key.append("g").attr("class", "x axis").attr("transform", "translate(10,140)").call(xAxis).append("text").attr("transform", "rotate(0)").attr("y", 30).attr("x",200).attr("dy", ".70em").style("text-anchor", "end").text("Correlation");
    }

    function hovered(d, i, j) {
        if (i > listOfXchanges.length - 1) {
            j = i % listOfXchanges.length;
            i = Math.floor(i / listOfXchanges.length);
        }
        var yName = listOfXchanges[i];
        var xName = listOfXchanges[j];
        drawScatterChart(xName, yName);
    }

    function mouseover(p) {
        d3.selectAll("text").classed("active", function(d, i) {
            return i == p.y;
        });
        d3.selectAll("text").classed("active", function(d, i) {
            return i == p.x;
        });
    }

    function mouseout() {
        d3.selectAll("text").classed("active", false);
    }

}

function drawScatterChart(xExchange, yExchange) {



    /* BEFORE DATA */
    // chart size
    var outerWidth = 620;
    var outerHeight = 440;
    var margin = {
        left: 50,
        top: 120,
        right: 30,
        bottom: 40
    };
    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.bottom;
    var innerHeightOffset = innerHeight + 1;
    var rMin = 3; // "r" stands for radius
    var rMax = 20;
    var xAxisLabelText = xExchange;
    var xAxisLabelOffset = 30;
    var yAxisLabelText = yExchange;
    var yAxisLabelOffset = 40;

    var zAxisLabelText = "Not Required atm"



    // Select SVG element on the DOM
    var SVG = d3.select("#main2").attr("width", outerWidth).attr("height", outerHeight).attr("y",60);
    // Remove previous line charts
    SVG.selectAll("g").remove();
    //  Line chart group
    var group = SVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //  xAxis Group
    var xAxisG = group.append("g").attr('class', 'axis').attr('transform', 'translate(0,' + innerHeightOffset + ')');
    // yAxis Group
    var yAxisG = group.append("g").attr('class', 'axis').attr('transform', 'translate(-2,0)');

    var colorLegendG = SVG.append("g")
        .attr("class", "color-legend")
        .attr("transform", "translate(600, 10)");



    var xAxisLabel = xAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", xAxisLabelOffset)
        .attr("class", "label")
        .text(xAxisLabelText);

    var yAxisLabel = yAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
        .attr("class", "label")
        .text(yAxisLabelText);



    // create axis scale: Pixel Space
    var xScale = d3.scale.linear().range([0, innerWidth]);
    var yScale = d3.scale.linear().range([innerHeight, 0]);
    //var rScale = d3.scale.linear().range([rMin,rMax]);
    var colorScale = d3.scale.category10();


    // define x and y axis
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickFormat(d3.format(".2s"))
        .outerTickSize(0);
    var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(d3.format(".2s"))
        .outerTickSize(0);

    var colorLegend = d3.legend.color()
        .scale(colorScale)
        .shapePadding(4)
        .shapeWidth(10)
        .shapeHeight(10)
        .labelOffset(4)



    // label
    d3.select("#label2").html("Visualization of " + xExchange + " vs " + yExchange);

    /* AFTER DATA */

    // get Data


    var myArrayOfObjects = [];
    var myArrayOfArray = [];

    var xData = marketCap[xExchange].data;
    var yData = marketCap[yExchange].data;
    for (var i = 0; i < xData.length; i++) {

        if (xData[i] > 0 && yData[i] > 0) {
            var point = {
                xColumn: xData[i], // date array global
                yColumn: yData[i],
                /* zColumn: data3[parseInt(timeYearString) - 1980],
                 year: timeYearString,
                 country:listOfLocalities[rowNumber],
                 colorColumn: getRegion(listOfLocalities[rowNumber]) */
            }
            myArrayOfObjects.push(point);
            myArrayOfArray.push([xData[i], yData[i]]);
        }

    }


    //define axis domain scale: Data Space
    xScale.domain(d3.extent(myArrayOfObjects, function(d) {
        return d.xColumn;
    })).nice();
    yScale.domain(d3.extent(myArrayOfObjects, function(d) {
        return d.yColumn;
    })).nice();
    // rScale.domain(d3.extent(myArrayOfObjects, function (d){ return d.zColumn; })).nice();
    // colorScale.domain(region);
    //rScale.domain(d3.extent(myArrayOfObjects, function (d){ return d[rColumn]; }));
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    //bind data


    var circles = group.selectAll("circle").data(myArrayOfObjects);

    //Enter
    circles.enter().append("circle");

    //update
    circles
        .attr("cx", function(d) {
            return xScale(d.xColumn);
        })
        .attr("cy", function(d) {
            return yScale(d.yColumn);
        })
        .attr("r", "5")
        // .attr("r",       function (d){ return       rScale(d.zColumn);     })
        .attr("fill", function(d) {
            return colorScale(d.colorColumn);
        })
        .attr("class", "dot");



    // colorLegendG.call(colorLegend);


    //draw line

    var data = myArrayOfArray
    var result = regression('linear', data);
    var slope = result.equation[0];
    var yIntercept = result.equation[1];

    lm_line = group.append("line");

    lm_line
        .attr("class", "lm-line")
        .attr("x1", xScale(xScale.domain()[0]))
        .attr("x2", xScale(xScale.domain()[1]))
        .attr("y1", yScale(xScale.domain()[0] * slope + yIntercept))
        .attr("y2", yScale(xScale.domain()[1] * slope + yIntercept));
}
