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
var months = ["January","February","March","April","May","June","July","August","September","October","Novemberv","December"];
var marketCap =[];
var correlationMatrix =[];

main();

var firstArray=[1,2,3,4,5,6];
var secondArray=[9,8,7,6,4,3];
getPCC(firstArray,secondArray);

function getPCC(x,y) {

   /* Calculate the mean (average) of x and y
    2. Subtract the mean of x from every x value (call it “a“), the same for y (call it “b“)
    3. Calculate a x b, a2 and b2 for every value
    4. Sum a x b, sum a2, sum b2
    5. Divide the sum of a x b by the square root of ((sum of a2) x (sum of b2)) */



    var shortestArrayLength = 0;
    if(x.length == y.length)

        shortestArrayLength = x.length;
    else if(x.length>y.length)
    {
        shortestArrayLength = y.length;
        console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
    }
    else
    {
        shortestArrayLength = x.length;
        console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
    }
    var xy = [];
    var x2 = [];
    var y2 = [];
    for(var i=0; i<shortestArrayLength; i++)
    {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;
    for(var i=0; i<shortestArrayLength; i++)
    {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }
    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;

    if (isNaN(answer)){
        console.log("coefficient: "+answer);
        return 0;
    }else{
        console.log("coefficient: "+answer);
        return answer;
    }


}



function fetchData(dataCategory,dataRows) {
    // loop through all the rows in file
    console.log(" Reading file object for : "+ dataCategory );
    for (var rowNumber = 0; rowNumber < dataRows.length; rowNumber++) {
        var record = dataRows[rowNumber];
        // make an object to store data for the current exchange
        var exchange = {
            name: record.Exchange,
            data: []
        }

        marketCap[record.Exchange]= {};
        // loop through all months, from Jan to Dec for specific Xchagne
        for (var i = 0; i <12; i++) {
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


        if (listOfXchanges.indexOf(record.Exchang) === -1)
        listOfXchanges.push(record.Exchange); // add exchange to list of Xchange


        marketCap[exchange.name].data=exchange.data;
        console.log("Gotcha: "+ dataCategory+" :"+ marketCap[exchange.name] );

        }

       listOfXchanges.sort();

  //  console.log("Gotcha: "+ dataCategory+" :"+ marketCap.ex );

}


function buildCorrelationMatrix() {


    for(i=0;i<listOfXchanges.length;i++)
    {
        correlationMatrix[i]=[];
        var firstArray=marketCap[listOfXchanges[i]].data;
         for(j=0;j<listOfXchanges.length;j++){
              var secondArray=marketCap[listOfXchanges[j]].data;
             correlationMatrix[i][j]= getPCC(firstArray,secondArray);
         }
    }

}

function doStuff(url,dataCategory,dataRows)
{
    fetchData(dataCategory,dataRows)
    buildCorrelationMatrix();
    plotGraph();
}



function parseData(url,dataCategory,callBack) {


    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        header: true,
        complete: function(results) {
            callBack(url,dataCategory,results.data);
        }
    });

}



function main(){


    // read file for various categories ( lets read one for the moment )
    parseData("data/2010MarketCap.csv", "Market Capitalization", doStuff);

    // get exchanges
    // find pcc
    // send data to patric's viz


}



function plotGraph(){

    var margin = {
            top: 80,
            right: 0,
            bottom: 10,
            left: 60
        },
        width = 720,
        height = 720;
    var gridSize = Math.floor(width / 9 * 0.15);
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

     var colorScale=d3.scale.linear().domain([-1, 0, 1]).range(["darkslateblue", "white", "crimson"])

    var max = 0,
        maxi = 0,
        maxj = 0;

    var t = d3.transition()
        .duration(750);
    var orderString = "";

    var clusterMatrix = jQuery.extend(true, [], correlationMatrix);

        function Merge(clusterMatrix, first, index) {
            for (var k = 0; k < clusterMatrix[first].length; k++) {
                if (clusterMatrix[first][k] < clusterMatrix[index][k]) {
                    clusterMatrix[first][k] = clusterMatrix[index][k];
                }
            }
            orderString = listOfXchanges[first] + "," + listOfXchanges[index];
            for (var p = 0; p < clusterMatrix.length; p++) {
                clusterMatrix[p].splice(index, 1);
            }
            return clusterMatrix;
        }
        /*while (orderString.length != listOfXchanges.length) {
            for (var i = 0; i < clusterMatrix.length; i++) {
                for (var j = 0; j < clusterMatrix[i].length; j++) {
                    if ((max < clusterMatrix[i][j]) && (clusterMatrix[i][j] != 1)) {
                        max = clusterMatrix[i][j];
                        maxi = i;
                        maxj = j;
                    }
                }
            }
            clusterMatrix = Merge(clusterMatrix, maxi, maxj);
            max = 0;
        }*/

        DrawMatrix(correlationMatrix, t, gridSize);
        Drawaxis(listOfXchanges, t, gridSize);

        d3.select("#order")
            .on("click", function(d) {
                console.log("called");
                Cluster(listOfXchanges, clStock, correlationMatrix)
            });

        function Cluster(listOfXchanges, orderString, correlationMatrix) {
            var order = orderString.split(",");
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

        function Order(listOfXchanges, correlationMatrix, tempindex, newindex) {
            var temp = "",
                tempnum = 0;
            temp = listOfXchanges[newindex];
            listOfXchanges[newindex] = listOfXchanges[tempindex];
            listOfXchanges[tempindex] = temp;
            var temparr = correlationMatrix[tempindex]
            correlationMatrix[tempindex] = correlationMatrix[newindex];
            correlationMatrix[newindex] = temparr;
            for (j = 0; j < listOfXchanges.length; j++) {
                tempnum = correlationMatrix[j][newindex];
                correlationMatrix[j][newindex] = correlationMatrix[j][tempindex];
                correlationMatrix[j][tempindex] = tempnum;
            }
        }
        console.log(listOfXchanges);
        console.table(correlationMatrix);

        function Drawaxis(listOfXchanges, t, gridSize) {
            svg.selectAll(".yAxis").remove();
            svg.selectAll(".xAxis").remove();

            var y = d3.scale.ordinal()
                .domain(listOfXchanges)
                .rangePoints([gridSize/2, (height * 0.3) - gridSize/2]);
            var x = d3.scale.ordinal()
                .domain(listOfXchanges)
                .rangePoints([gridSize / 2, (width * 0.3) - gridSize / 2]);
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top");
            svg.append("g") // Add the X Axis
                .attr("class", "xAxis")
                .attr("transform", "translate(100,0)")
                .call(xAxis)
                .selectAll("text")
                .attr("y", -5)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "translate(0,0) rotate(-90)")
                .style("text-anchor", "start");
            svg.append("g") // Add the X Axis
                .attr("class", "yAxis")
                .attr("transform", "translate(40,10)")
                .call(yAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 0)
                .attr("dy", ".35em")
                .attr("transform", "translate(50,0)")
                .style("text-anchor", "end");

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
                    return i * gridSize + 100;
                })
                .attr("y", function(d, i, j) {
                    return j * gridSize;
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

        }





    function hovered(d,i,j) {
        if(i>listOfXchanges.length-1){
            j=i%listOfXchanges.length;
            i= Math.floor(i/listOfXchanges.length);
        }
        var yName = listOfXchanges[i];
        var xName = listOfXchanges[j];
        alert(d);
    }





}


