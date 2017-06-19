var arrDate = [];
var arrAllData;

// Establecer las dimensions del canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    widthL = 600 - margin.left - margin.right,
    heightL = 285 - margin.top - margin.bottom;

// Dar formato a las fechas, usar Año
var parseDate = d3.time.format("%Y").parse;

// Filtro por pais
function countryFilter(data) {
    if (data.area === countryName) {
        arrDate.push(data.date);
        return data;
    }
}

// Establecer los rangos para x y y para los ejes
var xl = d3.time.scale().range([0, widthL]);
var yl = d3.scale.linear().range([heightL, 0]);

// Definir eje x 
var xAxis = d3.svg.axis().scale(xl)
    .orient("bottom").ticks(5);

// Definir eje y
var yAxis = d3.svg.axis().scale(yl)
    .orient("left").ticks(5);

// Definir la linea
var valueline = d3.svg.line()
    .x(function(d) { return xl(d.date); })
    .y(function(d) { return yl(d.value); });
    
// Crear SG y definir caracteristicas iniciales
var svgL = d3.select("#d3line")
    .append("svg")
        .attr("width", widthL + margin.left + margin.right)
        .attr("height", heightL + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Cargar datos iniciales
d3.csv("src/data/UNdata.csv", function(error, data) {
    arrDate=[];
    data = data.filter(countryFilter);
    arrAllData = data;
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    //Establecer la scala de acuerdo al rango de los datos 
    xl.domain(d3.extent(data, function(d) { return d.date; }));
    yl.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Agragar valores para la linea
    svgL.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Agragar el eje X
    svgL.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightL + ")")
        .call(xAxis);

    // Agragar el eje Y
    svgL.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //Llamar a actualizar el grafico de tarta
    change(randomData());

});

/*var inter = setInterval(function() {
                updateData();
        }, 5000);*/ 

// ** Actualizar la seccion de datos
function updateData() {

    // Cargar datos
    d3.csv("src/data/UNdata.csv", function(error, data) {
        arrDate=[];
        data = data.filter(countryFilter);
        arrAllData = data
       	data.forEach(function(d) {
	    	d.date = parseDate(d.date);
	    	d.value = +d.value;
	    });

    	//Establecer la scala de acuerdo al rango de los datos nuevos
    	xl.domain(d3.extent(data, function(d) { return d.date; }));
	    yl.domain([0, d3.max(data, function(d) { return d.value; })]);

    //Seleccionar la seccion a la que se quiere actualizar los datos nuevos
    var svgL = d3.select("#d3line").transition();

    // Realizar cambios
        svgL.select(".line")   // Cambios a la linea
            .duration(750)
            .attr("d", valueline(data));
        svgL.select(".x.axis") // cambios al eje X
            .duration(750)
            .call(xAxis);
        svgL.select(".y.axis") // cambios al eje Y
            .duration(750)
            .call(yAxis);

        //Llamar a actualizar el grafico de tarta
        change(randomData());

    });

}