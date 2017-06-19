var countryName = "Ecuador";

//Definicion de dimensiones para el mapa en Pxeles
var width = 400,
    height = 600;

//Proyeccion para el mapa
var projection = d3.geo.mercator()
    .scale(400.20355310639263)
    .center([-63.115436566301206,-26.26930158426038]) //Define el centro de la proyeccion
    .translate([width/2,height/2]) //Ubicar el centro del mapa

//Generar rutas basado en la proyeccion
var path = d3.geo.path()
    .projection(projection);

//Crear SVG para el Mapa
var svg = d3.select("#d3map").append("svg")
    .attr("width", width)
    .attr("height", height);

//dentro del SVG crear un grupo y asignarle la clase features
var features = svg.append("g")
    .attr("class","features");

//Configuraciones para el zoom del mapa
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 1])
    .on("zoom",zoomed);

svg.call(zoom);

//Crear los elementos necesarios para el tooltip que mostrara el mobre del pais, Oculto inicialmente
var tooltip = d3.select("#d3map").append("div").attr("class","tooltip");

//cargar los datos del archivo .toposon
d3.json("src/data/south-america.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console

  //Create a path for each map feature in the data
  //Crear y definir cada uno de los paises con sus caracteristicas especificados en el archivo .topposon
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.continent_South_America_subunits).features) //generar las caracteristicas dese el TopoJSON
    .enter()
    .append("path")
    .attr("class", "map")
    .attr("d",path)
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);

});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {

}


//Actualizar mapa cuando se realize zoom
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}


//Posicion del tol tip relativo al cursor
var tooltipOffset = {x: 5, y: -25};

//Crear tooltip, Inicialmente Oculto
function showTooltip(d) {
  moveTooltip();
  countryName = d.properties.geounit;
  console.log(countryName);
  updateData();
  tooltip.style("display","block")
      .text(d.properties.geounit);
}

//Mover el tooltip para seguir al mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Crear tooltip, Inicialmente Oculto
function hideTooltip() {
  tooltip.style("display","none");
}