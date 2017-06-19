//Crear elementos SVG
var svg = d3.select("#d3pie")
	.append("svg")
	.attr("width", "100%")
    .attr("height", "100%")
	.append("g")

//Definir caracteristicas iniciales del SVG
svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

//Tamaño del grafico
var width = 600,
    height = 255,
	radius = Math.min(width, height) / 2;

//Crear el grafico de tipo tarta (Pie)
var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

//Definir el radio del arco de entrada
var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

//Definir el radio del arco de salida
var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

//Establecer las dimensiones al SVG
svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Obtener las etiquetas 
var key = function(d){ return d.data.label; };


var color;

/*d3.csv("src/data/UNdata.csv", function(error, data) {
	if (error) return console.log(error); //unknown error, check the console

	/*dataDomain = data.map(function(d){
		return d.date;
	});*/


//Cargar los datos provenientes de acuerdo al pais seleccionado
function randomData (){
	//Definir el dominio y el rango de colores que se visualizaran en el grafico de tarta
	color = d3.scale.ordinal()
	.domain(arrDate)
	//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	.range(["#f5967f", "#e6243c"]);

	//Enviar las etiquetas y el valor a visualizar
	var labels = color.domain();
	return labels.map(function(label){
		return { label: label, value: getValue(label)}
	});

}

//Obtener el valor que corresponde a cada etiqueta
function getValue(labelsd){
	var resultValue
	arrAllData.some(function(d){
		if (d.date.getFullYear() == labelsd) {
			resultValue = d.value
			return d.value;
		}
	});
	return resultValue;
}

//Cargar los valores y visualizar
change(randomData());

/*d3.select(".randomize")
	.on("click", function(){
		change(randomData());
	});*/


//Actualizar grafico cuando se realice cambios
function change(data) {

	/* ------- PIE SLICES -------*/
	
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();
};