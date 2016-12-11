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
var listOfXchangesMcap = [];
var listOfXchangesBSI = [];
var listOfXchangesTV = [];
var listOfXchangesER = [];
var listOfXchangesBC = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var marketCap = [];
var BSIPerformance = [];
var turnoverVelocity = [];
var exchangeRate = [];
var blueChip = [];
var correlationMatrixMCap = [];
var correlationMatrixBSI = [];
var correlationMatrixTV = [];
var correlationMatrixER = [];
var correlationMatrixBC = [];

var orderString = "";
var resultarray = [];
var currentCategory="Market Capitalization";
var myDeferredMCap=new $.Deferred();
var myPromiseMCap=myDeferredMCap.promise();

var myDeferredBC=new $.Deferred();
var myPromiseBC=myDeferredBC.promise();

var myDeferredBSI=new $.Deferred();
var myPromiseBSI=myDeferredBSI.promise();

var myDeferredTV=new $.Deferred();
var myPromiseTV=myDeferredTV.promise();

var myDeferredER=new $.Deferred();
var myPromiseER=myDeferredER.promise();






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






        if(dataCategory==="Market Capitalization"){
            if (listOfXchangesMcap.indexOf(record.Exchange) === -1)
                listOfXchangesMcap.push(record.Exchange); // add exchange to list of Xchange
            marketCap[exchange.name] = {};
            marketCap[exchange.name].data = exchange.data;
            console.log("Gotcha: " + dataCategory );
        }
       else if (dataCategory==="Broad Stock Index Performance") {

            if (listOfXchangesBSI.indexOf(record.Exchange) === -1)
                listOfXchangesBSI.push(record.Exchange); // add exchange to list of Xchange
            BSIPerformance[exchange.name] = {};
            BSIPerformance[exchange.name].data = exchange.data;
            console.log("Gotcha: " + dataCategory );
        }
        else if (dataCategory==="Turn Over Velocity") {
            if (listOfXchangesTV.indexOf(record.Exchange) === -1)
                listOfXchangesTV.push(record.Exchange); // add exchange to list of Xchange
            turnoverVelocity[exchange.name] = {};
            turnoverVelocity[exchange.name].data = exchange.data;
            console.log("Gotcha: " + dataCategory );
        }
        else if (dataCategory==="Exchange Rate") {
            if (listOfXchangesER.indexOf(record.Exchange) === -1)
                listOfXchangesER.push(record.Exchange); // add exchange to list of Xchange
            exchangeRate[exchange.name] = {};
            exchangeRate[exchange.name].data = exchange.data;
            console.log("Gotcha: " + dataCategory );
        }
        else if (dataCategory==="Blue Chip Index") {
            if (listOfXchangesBC.indexOf(record.Exchange) === -1)
                listOfXchangesBC.push(record.Exchange); // add exchange to list of Xchange
            blueChip[exchange.name] = {};
            blueChip[exchange.name].data = exchange.data;
            console.log("Gotcha: " + dataCategory );
        }

    }

    //listOfXchanges.sort();



    //  console.log("Gotcha: "+ dataCategory+" :"+ marketCap.ex );
    if(dataCategory==="Market Capitalization"){
        correlationMatrixMCap= buildCorrelationMatrix(listOfXchangesMcap,marketCap);
        console.log("MatrixGotcha: " + dataCategory );
        myDeferredMCap.resolve();
    }
   else if (dataCategory==="Broad Stock Index Performance") {
        correlationMatrixBSI=buildCorrelationMatrix(listOfXchangesBSI,BSIPerformance);
        console.log("MatrixGotcha: " + dataCategory );
        myDeferredBSI.resolve();
    }
    else if (dataCategory==="Turn Over Velocity") {
        correlationMatrixTV=buildCorrelationMatrix(listOfXchangesTV,turnoverVelocity);
        console.log("MatrixGotcha: " + dataCategory );
        myDeferredTV.resolve();
    }
    else if (dataCategory==="Exchange Rate") {
        correlationMatrixER=buildCorrelationMatrix(listOfXchangesER,exchangeRate);
        console.log("MatrixGotchaha: " + dataCategory );
        myDeferredER.resolve();
    }
    else if (dataCategory==="Blue Chip Index") {
        correlationMatrixBC=buildCorrelationMatrix(listOfXchangesBC,blueChip);
        console.log("MatrixGotcha: " + dataCategory );
        myDeferredBC.resolve();
    }


}


function buildCorrelationMatrix(listOfXchanges,sourceData) {


    var dataArr = [];
    var correlationMatrix=[]

    for (i = 0; i < listOfXchanges.length; i++) {
        correlationMatrix[i] = [];
        dataArr[0] = sourceData[listOfXchanges[i]].data;
        for (j = 0; j < listOfXchanges.length; j++) {
            dataArr[1] = sourceData[listOfXchanges[j]].data;
            correlationMatrix[i][j] = pearsonCorrelation(dataArr, 0, 1);
            //correlationMatrix[i][j] = getPCC(dataArr[0],dataArr[1]);
        }
        if (correlationMatrix[i][i] == 0) {
            correlationMatrix[i][i] = 1;
        }
    }

    return correlationMatrix

}

function doStuff(url, dataCategory, dataRows) {
    fetchData(dataCategory, dataRows);

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


function plotGraph() {

    var correlationMatrix;
    var listOfXchanges;
    if(currentCategory=="Market Capitalization"){
        correlationMatrix=correlationMatrixMCap
        listOfXchanges=listOfXchangesMcap;
    } else if (currentCategory=="Broad Stock Index Performance") {
        correlationMatrix=correlationMatrixBSI
        listOfXchanges=listOfXchangesBSI;
    } else if (currentCategory=="Turn Over Velocity") {
        correlationMatrix=correlationMatrixTV
        listOfXchanges=listOfXchangesTV;
    } else if (currentCategory=="Exchange Rate") {
        correlationMatrix=correlationMatrixER;
        listOfXchanges=listOfXchangesER;
    } else if (currentCategory=="Blue Chip Index") {
        correlationMatrix=correlationMatrixBC
        listOfXchanges=listOfXchangesBC;
    }

    var margin = {
            top: 30,
            right: 0,
            bottom: 10,
            left: 60
        },
        width = 900,
        height = 900;
    var gridSize = Math.floor(width / 9 * 0.14);

    var svg = d3.select("#matrix");

    // Remove previous  charts
    svg.selectAll("g").remove();
    svg.attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", -margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var colorScale = d3.scale.linear().domain([1, 0, -1]).range(["#4d9221", "#f7f7f7", "#c51b7d"]);

    var max = -2,
        maxi = 0,
        maxj = 0;

    var t = d3.transition().duration(750);

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
            .on("click", cellClick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    }



    function drawLegend(){
      var w = 340, h = 200;

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

    function cellClick(d, i, j) {
        if (i > listOfXchanges.length - 1) {
            j = i % listOfXchanges.length;
            i = Math.floor(i / listOfXchanges.length);
        }
        var yName = listOfXchanges[i];
        var xName = listOfXchanges[j];
        //drawScatterChart(xName, yName);

        drawLineChart(currentCategory,"first",xName);
        drawLineChart(currentCategory,"second", yName);
       // drawCircleChart(xName, yName);
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



function drawLineChart(currentCategory,id,exchange) {

    var targetSVG=""
    if(id=="first") targetSVG="#line1";
    else targetSVG="#line2";

    /* BEFORE DATA */
    var outerWidth = 600;
    var outerHeight = 400;
    var margin = { left: 80, top: 10, right: 10, bottom: 80 };
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;
    var innerHeightOffset = innerHeight+1;
    var xAxisLabelText = "Time (Months)";
    var xAxisLabelOffset = 60;
    var yAxisLabelText =currentCategory+"(USD Millions)";
    var yAxisLabelOffset = 60;

    // Select SVG element on the DOM
    var SVG = d3.select(targetSVG).attr("width",outerWidth).attr("height",outerHeight);
    // Remove previous line charts
    SVG.selectAll("g").remove();
    //  Line chart group
    var group=SVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Line group
    var path=group.append("path");

    //xAxis Group
    var xAxisG=group.append("g").attr('class', 'axis').attr('transform', "translate(0," + innerHeightOffset + ")");
    // yAxis Group
    var yAxisG= group.append("g").attr('class', 'axis').attr('transform', 'translate(-2,0)');

    var titleG=group.append("g").attr('class', 'graphtitle'); //.attr('transform', 'translate(innerWidth/2,0)');

    titleG.append("text")
        .style("text-anchor", "middle")
        .attr("x", innerWidth/2)
        .attr("y", -2)
        .attr("dy", ".35em")
        .text(exchange);


    var xAxisLabel = xAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("x", innerWidth/2)
        .attr("y", xAxisLabelOffset)
        .attr("class", "label")
        .text(xAxisLabelText);





    var yAxisLabel = yAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
        .attr("class", "label")
        .text(yAxisLabelText);


    // create axis scale: Pixel Space
    var xScale = d3.scale.ordinal().rangePoints([0, innerWidth]); var xScaleLinear = d3.scale.linear().range([0, innerWidth]);
    var yScale = d3.scale.linear().range([innerHeight, 0]);


    // define x and y axis
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(d3.format("0.2s"))
        .outerTickSize(0);

    var myArrayOfObjects= [];
    var myArrayOfArray = [];
    var data=[];
    if(currentCategory==="Market Capitalization"){
        data = marketCap[exchange].data;
    } else if (currentCategory==="Broad Stock Index Performance") {
        data = BSIPerformance[exchange].data;
    } else if (currentCategory==="Turn Over Velocity") {
        data = turnoverVelocity[exchange].data;
    } else if (currentCategory==="Exchange Rate") {
        data = exchangeRate[exchange].data;
    } else if (currentCategory==="Blue Chip Index") {
        data = blueChip[exchange].data;
    }


    for (var i = 0; i < data.length; i++) {

        var point = { xColumn: months[i],yColumn: data[i] }

            myArrayOfObjects.push(point);
            myArrayOfArray.push([i,data[i]]);

        }

    //define axis domain scale: Data Space
    xScale.domain(myArrayOfObjects.map(function(d) { return d.xColumn; }));
    //xScaleLinear.domain(d3.extent([0,12]));
    yScale.domain(d3.extent(myArrayOfObjects, function (d){ return d.yColumn; })).nice();


    var myLineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.xColumn); })
        .y(function(d) { return yScale(d.yColumn); });


    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

    var xAxisTicks= xAxisG.selectAll(".tick text");
    xAxisTicks.style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" );

    path.attr("d", myLineFunction(myArrayOfObjects))
        .attr("class","line");


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
        .attr("class", "dot");

  /*
    //code for regression need to fix
    var data = myArrayOfArray
    var result = regression('linear', data);
    var slope = result.equation[0];
    var yIntercept = result.equation[1];

    lm_line = group.append("line");

    lm_line
        .attr("class", "lm-line")
        .attr("x1", xScale(xScale.domain()[0]))
        .attr("x2", xScale(xScale.domain()[1]))
        .attr("y1", yScale(xScale(xScale.domain()[0]) * slope + yIntercept))
        .attr("y2", yScale(xScale(xScale.domain()[1]) * slope + yIntercept));
        */

}

function drawCircleChart(xName,Yname)
{


}






function updateToMarketCap(){
    currentCategory="Market Capitalization";
    plotGraph()
}

function updateToBlueChip(){
    currentCategory="Blue Chip Index";
    plotGraph()
}

function updateToBSI(){
    currentCategory="Broad Stock Index Performance";
    plotGraph()
}
function updateToTV(){
    currentCategory="Turn Over Velocity";
    plotGraph()
}

function updateToER(){
    currentCategory="Exchange Rate";
    plotGraph()
}

function Cluster(){
    
    //plotGraph()
}

function main() {


    // read file for various categories ( lets read one for the moment )
    parseData("data/2010MarketCap.csv", "Market Capitalization", doStuff);
    parseData("data/2010BlueChip.csv", "Blue Chip Index", doStuff);
    parseData("data/2010BroadStockIndexPerformance.csv", "Broad Stock Index Performance", doStuff);
    parseData("data/2010TurnOverVelocity.csv", "Turn Over Velocity", doStuff);
    parseData("data/2011ExchangeRates.csv", "Exchange Rate", doStuff);


    // get exchanges
    // find pcc
    // send data to patric's viz

   /* $.when(myPromiseMCap,myPromiseBC,myPromiseBSI,myPromiseER,myPromiseTV)
        .done ( function() {
            plotGraph();
            }); */


    $.when(myPromiseMCap,myPromiseBC,myPromiseBSI,myPromiseER,myPromiseTV)
        .done ( function() {
            plotGraph();
        });

}
