/* (C)2014 @animateddata */
function init() {
    var a = d3.extent(data, function(a) {
        return a.yr
    });

    var graus = d3.extent(data, function(a) {
        return a.mean
    });

    var cores = [];
    cores.push(graus[0]);
    cores.push((graus[0] + graus[1]) / 2 );
    cores.push(graus[1]);
    

    var xtics = [a[0]];
    quantos_ticks = 11;
    tam_espacos = (a[1] - a[0]) / quantos_ticks;

    for (var i = 1; i < quantos_ticks; i++ ){
        xtics.push(xtics[xtics.length -1] + Math.ceil(tam_espacos));
    }

    years = d3.range(a[0], a[1] + 1), 
    xScale = d3.scale.ordinal().domain(years).rangePoints([0, width]), 
    /*yScale = d3.scale.linear().domain([-2, 18]).range([height, 0])*/
    yScale = d3.scale.linear().domain(graus).range([height, 0]), 
    colorScale = d3.scale.linear().domain(cores).range(["blue", "orange", "red"]), 
    monthScale = d3.scale.ordinal().domain(d3.range(0, 12)).rangePoints([0, width]), 

    xAxis = d3.svg.axis().tickValues(xtics).scale(xScale), 
    
    yAxis = d3.svg.axis().orient("right").ticks(12).tickSize(width).scale(yScale).tickFormat(function(a) {
        return a + "°C"
    });
    var b = 20;
    voronoi = d3.geom.voronoi().x(function(a) {
        return a.x
    }).y(function(a) {
        return a.y
    }).clipExtent([
        [-b, 0],
        [width + b, height]
    ]), d3.select("svg").on("mouseover", function() {
        uiState.hoveredPoint = null, d3elements.tooltip.transition().style("opacity", 0), d3elements.highlighter.transition().style("opacity", 0), updateMonthLine()
    })
}

function updatePointPositions() {
    data = data.map(function(a) {
        var b = [Math.random() + .01, .01 * Math.random()];
        return a.y = yScale(a[mode]) + b[1], a.x = xScale(a.yr) + b[0], a.color = colorScale(a[mode]), a
    });
    var a = voronoi(data);
    data = data.map(function(b, c) {
        return b.polygon = a[c], b
    })
}

function updateAxes() {
    d3elements.xAxis.call(xAxis), d3elements.yAxis.call(yAxis), d3elements.yAxis.selectAll("text").attr("x", -5)
}

function updateMonthLine() {
    var a = [],
        b = "";
    if (null !== uiState.hoveredPoint) {
        var c = d3.select(uiState.hoveredPoint).datum().mth,
            a = data.filter(function(a) {
                return a.mth === c
            });
        b = monthLineGenerator(a)
    }
    d3elements.monthLine.transition().attr("d", b)
}

function updateTooltip(a, b, c, d, e) {
    d3elements.tooltip.style("opacity", .85).attr("transform", "translate(" + a + "," + b + ")"), d3elements.tooltip.select(".content .title").text(months[c-1] + " " + d), d3elements.tooltip.select(".content .temp").text(e + "°C")
}

function updateHighlighter(a, b) {
    d3elements.highlighter.attr("r", 20).style("opacity", 0).attr("cx", a).attr("cy", b).transition().duration(1e3).ease("bounce").style("opacity", .7).attr("r", 6)
}

function updatePoints() {
    var a = d3elements.points.selectAll("g").data(data),
        b = a.enter().append("a").append("g").on("mouseover", function(a) {
            uiState.hoveredPoint !== this && (uiState.hoveredPoint = this, updateHighlighter(a.x, a.y), updateTooltip(a.x, a.y, a.mth, a.yr, a.mean), updateMonthLine()), d3.event.stopPropagation()
        });
    d3elements.points.selectAll("a").filter(function(a) {
        return a.yr >= 2001
    }).attr("xlink:href", function(a) {
        return metOfficeURL + a.yr + "/" + fullMonths[a.mth]
    }).attr("target", "_blank"), b.append("path"), b.append("circle").attr("r", radius), a.exit().remove(), a.select("path").attr("d", function(a) {
        return a.polygon.length > 0 ? "M" + a.polygon.join(",") + "Z" : ""
    }), a.select("circle").attr("cy", function(a) {
        return a.y
    }).attr("fill", function(a) {
        return a.color
    }).attr("cx", function(a) {
        return a.x
    })
}

var width = 1e3,
    height = 550,
    radius = 2.5,
    data, mode = "mean",
    years = [],
    xScale, yScale, colorScale, monthScale, d3elements = {
        container: d3.select("svg .container"),
        points: d3.select("svg .points"),
        monthLine: d3.select("svg .month.line path"),
        xAxis: d3.select("svg .x.axis"),
        yAxis: d3.select("svg .y.axis"),
        highlighter: d3.select("svg .highlighter"),
        tooltip: d3.select("svg .tooltip")
    },
    uiState = {
        hoveredPoint: null
    },
    xAxis, yAxis, voronoi, months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    fullMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
    monthLineGenerator = d3.svg.line().x(function(a) {
        return a.x
    }).y(function(a) {
        return a.y
    }),
    metOfficeURL = "../";

    d3.json("data/bh.json", function(a, b) {
            data = b, init(), updatePointPositions(), updatePoints(), updateAxes()
        });
    

    function myFunction(jsonfile, nomeCidade) {
        //document.getElementById("chart").innerHTML = "<svg width=\"1100\" height=\"700\">\r\n\t\t\t\t\t\t  <defs>\r\n\t\t\t\t\t\t    <filter id=\"dropshadow\" height=\"130%\">\r\n\t\t\t\t\t\t      <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3\"\/> \r\n\t\t\t\t\t\t      <feOffset dx=\"2\" dy=\"2\" result=\"offsetblur\"\/>\r\n\t\t\t\t\t\t      <feComponentTransfer>\r\n\t\t\t\t\t\t        <feFuncA type=\"linear\" slope=\"0.2\"\/>\r\n\t\t\t\t\t\t      <\/feComponentTransfer>\r\n\t\t\t\t\t\t      <feMerge> \r\n\t\t\t\t\t\t        <feMergeNode\/>\r\n\t\t\t\t\t\t        <feMergeNode in=\"SourceGraphic\"\/> \r\n\t\t\t\t\t\t      <\/feMerge>\r\n\t\t\t\t\t\t    <\/filter>\r\n\t\t\t\t\t\t  <\/defs>\r\n\t\t\t\t\t\t\t<g class=\"container\" transform=\"translate(50, 80)\">\r\n\t\t\t\t\t\t\t\t<g class=\"x axis\" transform=\"translate(0, 570)\"><\/g>\r\n\t\t\t\t\t\t\t\t<g class=\"y axis\"><\/g>\r\n\t\t\t\t\t\t\t\t<g class=\"month line\">\r\n\t\t\t\t\t\t\t\t\t<path><\/path>\r\n\t\t\t\t\t\t\t\t<\/g>\r\n\t\t\t\t\t\t\t\t<g class=\"points\"><\/g>\r\n\t\t\t\t\t\t\t\t<circle class=\"highlighter\" r=\"6\"><\/circle>\r\n\t\t\t\t\t\t\t\t<g class=\"tooltip\" transform=\"translate(-1000, 0)\">\r\n\t\t\t\t\t\t\t\t\t<g class=\"wrapper\" transform=\"translate(-45, -75)\">\r\n\t\t\t\t\t\t\t\t\t\t<path d=\"M5,0l78,0a6,6 0 0 1 6,6l0,40a6,6 0 0 1 -6,6l-22,0L45,70L50,52L6,52a6,6 0 0 1 -6,-6l0,-40a6,6 0 0 1 6,-6\" filter=\"url(#dropshadow)\"><\/path>\r\n\t\t\t\t\t\t\t\t\t\t<g class=\"content\" transform=\"translate(45, 20)\">\r\n\t\t\t\t\t\t\t\t\t\t\t<text class=\"title\" translate=\"transform(0,3)\"><\/text>\r\n\t\t\t\t\t\t\t\t\t\t\t<text class=\"temp\" transform=\"translate(0,21)\"><\/text>\r\n\t\t\t\t\t\t\t\t\t\t<\/g>\r\n\t\t\t\t\t\t\t\t\t<\/g>\r\n\t\t\t\t\t\t\t\t<\/g>\r\n\t\t\t\t\t\t\t<\/g>\r\n\t\t\t\t\t\t<\/svg>";
        
        document.getElementById("cidade").innerHTML = nomeCidade;
        
        d3.json("data/"+jsonfile, function(a, b) {
            data = b, init(), updatePointPositions(), updatePoints(), updateAxes()
        });
        
    }