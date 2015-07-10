var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['1962 a 1979','1980 a 1997','1998 a 2015'];

//Data
var d = [
		  [
			{axis:"Dezembro",value:4.64},
			{axis:"Novembro",value:4.58},
			{axis:"Outubro",value:4.26},
			{axis:"Setembro",value:3.15},
			{axis:"Agosto",value:1.84},
			{axis:"Julho",value:1.03},
			{axis:"Junho",value:0.80},
			{axis:"Maio",value:1.91},
			{axis:"Abril",value:3.03},
			{axis:"Março",value:3.60},
			{axis:"Fevereiro",value:4.00},
			{axis:"Janeiro",value:4.34}
		  ],[
			{axis:"Dezembro",value:4.74},
			{axis:"Novembro",value:4.82},
			{axis:"Outubro",value:4.61},
			{axis:"Setembro",value:3.98},
			{axis:"Agosto",value:3.02},
			{axis:"Julho",value:1.94},
			{axis:"Junho",value:1.87},
			{axis:"Maio",value:2.73},
			{axis:"Abril",value:3.61},
			{axis:"Março",value:4.42},
			{axis:"Fevereiro",value:4.67},
			{axis:"Janeiro",value:4.64}
		  ],[
			{axis:"Dezembro",value:5.50},
			{axis:"Novembro",value:5.63},
			{axis:"Outubro",value:5.37},
			{axis:"Setembro",value:4.76},
			{axis:"Agosto",value:3.38},
			{axis:"Julho",value:2.68},
			{axis:"Junho",value:2.43},
			{axis:"Maio",value:3.63},
			{axis:"Abril",value:4.70},
			{axis:"Março",value:5.52},
			{axis:"Fevereiro",value:5.41},
			{axis:"Janeiro",value:5.48}
		  
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)
	

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Temperatura do Brasil em intervalos de 17 anos");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 700)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	
