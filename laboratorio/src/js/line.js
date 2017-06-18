var arrDate = [];
var arrAllData;

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    widthL = 600 - margin.left - margin.right,
    heightL = 285 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y").parse;

// Filtro por pais
function countryFilter(data) {
    if (data.area === countryName) {
        arrDate.push(data.date);
        return data;
    }
}

// Set the ranges
var xl = d3.time.scale().range([0, widthL]);
var yl = d3.scale.linear().range([heightL, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(xl)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(yl)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return xl(d.date); })
    .y(function(d) { return yl(d.value); });
    
// Adds the svg canvas
var svgL = d3.select("#d3line")
    .append("svg")
        .attr("width", widthL + margin.left + margin.right)
        .attr("height", heightL + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("src/data/UNdata.csv", function(error, data) {
    arrDate=[];
    data = data.filter(countryFilter);
    arrAllData = data;
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    // Scale the range of the data
    xl.domain(d3.extent(data, function(d) { return d.date; }));
    yl.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the valueline path.
    svgL.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svgL.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightL + ")")
        .call(xAxis);

    // Add the Y Axis
    svgL.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    change(randomData());

});

/*var inter = setInterval(function() {
                updateData();
        }, 5000);*/ 

// ** Update data section (Called from the onclick)
function updateData() {

    // Get the data again
    d3.csv("src/data/UNdata.csv", function(error, data) {
        arrDate=[];
        data = data.filter(countryFilter);
        arrAllData = data
       	data.forEach(function(d) {
	    	d.date = parseDate(d.date);
	    	d.value = +d.value;
	    });

    	// Scale the range of the data again 
    	xl.domain(d3.extent(data, function(d) { return d.date; }));
	    yl.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Select the section we want to apply our changes to
    var svgL = d3.select("#d3line").transition();

    // Make the changes
        svgL.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
        svgL.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svgL.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });

}