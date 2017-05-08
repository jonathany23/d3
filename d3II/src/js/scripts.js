//Definicion de variavles iniciales
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(150," + margin.top + ")");

/*var y0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);*/

  //Define la escala del eje Y
  var y0 = d3.scaleBand()
    .rangeRound([0, 400])
    .paddingInner(0.1);

//Define la escala para las leyendas
var y1 = d3.scaleBand()
    .padding(0.05);

//define la escala para el eje X
var x = d3.scaleLinear()
    .rangeRound([height, 0]);

//Array con los rangos de colores de las barras
var z = d3.scaleOrdinal()
    .range(["#f5967f", "#ea1d2d", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

//Cargar los datos desde el archivo csv
d3.csv("src/data/data.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  //Datos que corresponde a la etiquetas del eje Y
  y0.domain(data.map(function(d) { return d.Region; }));
  y1.domain(keys).rangeRound([0, y0.bandwidth()]);
  x.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  //Graficar las barras
  g.append("g")
    .attr("id", "mg")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0," + y0(d.Region)+")"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("y", function(d) { return y1(d.key); })
      .attr("x", 1)
      .attr("width", function(d) { return height - x(d.value); })
      .attr("height", y1.bandwidth())
      .attr("fill", function(d) { return z(d.key); });

  //Agregar etiqueta con el procentaje que corresponde a cada barra
  var txt = d3.select('#mg')
    .selectAll('g')
    .data(data)
//    .enter()
      .selectAll('text')
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter()
      .append('text')
        .attr('x', function(d) { return height - x(d.value); })
        .attr('y', function(d,i){ return y1(d.key)+12; })
        .text(function(d){ console.log("d: "+JSON.stringify(d)+" "+x(d.value)+" "+d.value); return d.value+"%"; })
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

  /*g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(y0));*/

  //Ubicar en el grafico las etiquetas del eje Y
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
      .text("Region");

  //Atributos de las leyendas, los anios y colores que los identifican en el grafico
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  //Ubicacion y posicion de las leyendas
  legend.append("rect")
      .attr("x", width - 150 - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  //Texto que basicamente son los años de las leyendas
  legend.append("text")
      .attr("x", width - 150 - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});