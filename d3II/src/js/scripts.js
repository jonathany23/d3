var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(150," + margin.top + ")");

/*var y0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);*/
  var y0 = d3.scaleBand()
    .rangeRound([0, 400])
    .paddingInner(0.1);

var y1 = d3.scaleBand()
    .padding(0.05);

var x = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#f5967f", "#ea1d2d", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("src/data/data.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  y0.domain(data.map(function(d) { return d.Region; }));
  y1.domain(keys).rangeRound([0, y0.bandwidth()]);
  x.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0," + y0(d.Region)+")"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("y", function(d) { console.log("y: "+d.key+" "+y1(d.key)); return y1(d.key); })
      .attr("x", 1)
      .attr("width", function(d) { return height - x(d.value); })
      .attr("height", y1.bandwidth())
      .attr("fill", function(d) { return z(d.key); });

  /*g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(y0));*/

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y0).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", x(x.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});