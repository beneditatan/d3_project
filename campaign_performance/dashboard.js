//colours that will be used for each metric
var colors = []
var gr = ["#0FDB00", "#28C301", "#42AC02", "#5B9503", "#757E04", "#8E6605", "#A84F06", "#C13807", "#DB2108", "#F50A0A"];
var blue = ["#230AC4", "#2024C9", "#1D3ECE", "#1B58D4", "#1872D9", "#168CDF", "#13A6E4", "#11C0EA", "#0EDAEF", "#0CF5F5"];
var brown = ["#94260A", "#9E320A", "#A93F0A", "#B44C0A", "#BF580A", "#C9650B", "#D4720B", "#DF7E0B", "#EA8B0B", "#F5980C"];
var green = ["#1E7004", "#2C7F03", "#3B8F03", "#4A9F02", "#58AF02", "#67BF01", "#76CF01", "#84DF00", "#93EF00", "#A2FF00"];

//extracting json file
d3.json("DS003a_Adwords_AdPerformance_modified.json", function(error, data) {

	data.forEach(function (d) {
        d.CampaignName = d.Campaign;
        d.cost = d.Cost;
        d.impressions = +d.Impressions;
        d.clicks = +d.Clicks;
        d.cpm = d.CPM;
        d.cpc = d.CPC;
    });
    
    //arrays that will store the values of top 10 campaigns according to the metric it is based on
    var cost = [];
    var campaigns = [];
    var impressions = [];
    var clicks = [];
    var cpm = [];
    var cpc = [];

    //values of top 10 campaigns based on cost
    var topData_cost = data.sort(function(a, b){
        return d3.descending(+a.cost, +b.cost);
    }).slice(0,10);
    for (i in topData_cost){
        cost.push(topData_cost[i].Cost);
        campaigns.push(topData_cost[i].Campaign);
    }

    //values of top 10 campaigns based on impressions
	var topData_imp = data.sort(function(a, b){
		return d3.descending(+a.impressions, +b.impressions);
	}).slice(0,10);	
	for (i in topData_imp){
		impressions.push(topData_imp[i].Impressions);
	}

	//values of top 10 campaigns based on clicks
	var topData_clicks = data.sort(function(a, b){
		return d3.descending(+a.clicks, +b.clicks);
	}).slice(0,10);
	for (i in topData_clicks){
		clicks.push(topData_clicks[i].Clicks);
	}

	//values of top 10 campaigns based on cpm
	var topData_cpm = data.sort(function(a, b){
		return d3.ascending(+a.cpm, +b.cpm);
	}).slice(0,10);
	for (i in topData_cpm){
		cpm.push(topData_cpm[i].CPM);
	}

	//values of top 10 campaigns based on cpc
	var topData_cpc = data.sort(function(a, b){
		return d3.ascending(+a.cpc, +b.cpc);
	}).slice(0,10);
	for (i in topData_cpc){
		cpc.push(topData_cpc[i].CPC);
	}

	//to create canvas and grids for the horizontal bar chart
    var canvas = d3.select('#wrapper')
						.append('svg')
						.attr({'width':1180,'height':600});

	var grid = d3.range(25).map(function(i){
		return {'x1':0,'y1':0,'x2':0,'y2':500};
	});

	//each box in the banner
	var banner0 = d3.select("#total_spend").append('p');
	var banner1 = d3.select("#impressions").append("p");
	var banner2 = d3.select("#clicks").append("p");
	var banner3 = d3.select("#cpc").append("p");
	var banner4 = d3.select("#cpm").append("p");

	//function to create the banner
	function banner(newData){
		
		//variables that store the values that will be displayed in the banner
		var totalSpend = 0;
	    var totalClicks = 0;
	    var totalImpressions = 0;
	    var avgCPC = 0;
	    var avgCPM = 0;
		var bannerData = [];

		//summing up the cost of the top 10 campaigns
		for (i in newData){
	    	totalSpend += newData[i].Cost;
	    }

	    //summing up the clicks of the top 10 campaigns
	    for (i in newData){
	    	totalClicks += parseInt(newData[i].Clicks);
	    }

	    //summing up the impressions of the top 10 campaigns
	    for (i in newData){
	    	totalImpressions += parseInt(newData[i].Impressions);
	    }

	    //averaging cpm and cpc of the top 10 campaigns
	    avgCPM = totalSpend/(totalImpressions/1000);
	    avgCPC = totalSpend/totalClicks;

	    //storing the variables above in an array
	    bannerData = [totalSpend, totalImpressions, totalClicks, avgCPC, avgCPM];

	    //appending the value of the variables to the banner
	    banner0.text(d3.format('$.2f')(bannerData[0])).style({'font-size': '28px'});
	    banner1.text(bannerData[1]).style({'font-size': '28px'}); 
	    banner2.text(bannerData[2]).style({'font-size': '28px'});
	    banner3.text(d3.format('$.3f')(bannerData[3])).style({'font-size': '28px'});
	    banner4.text(d3.format('$.3f')(bannerData[4])).style({'font-size': '28px'});
	}

	//function to create axis of the bar chart
    function startAxis(data, kpi, axis_y){
    	var domain_x = 0;
    	var interval = 0;
    	var formatAxis = d3.format();

    	//the value of x axis domain, interval, colour, and x axis formatting for each metric
    	switch(kpi){
    		case cost:
    			domain_x = 100000;
    			interval = 5000;
    			colors = green;
    			break;
    		case impressions:
    			domain_x = 110000000;
    			interval = 5500000;
    			colors = blue;
    			formatAxis = d3.format('.3s')
    			break;
    		case clicks:
	    		domain_x = 310000;
	    		interval = 15500;
	    		colors = brown;
	    		formatAxis = d3.format('.3s')
	    		break;
	    	case cpm:
	    		domain_x = 0.2;
    			interval = 0.01;
    			colors = gr;
    			formatAxis = d3.format(".3f");
    			break;
    		case cpc:
    			domain_x = 0.05;
    			interval = 0.0025;
    			colors = gr;
    			formatAxis = d3.format(".4f");
    			break;
    	};

    	//creating the scales accordingly
    	var xscale = d3.scale.linear()
					.domain([0, domain_x])
					.range([0, 1000])
		var yscale = d3.scale.linear()
					.domain([0, data.length])   
					.range([0, 480])

		//storing the value of each tick along the x axis
		var tickVals = grid.map(function(d,i){
			if(i>0){ 
				i = i*interval;
				return i; }
			else if(i===0){ return "0";}
		});

		//storing the color gradients
		var colorScale = d3.scale.quantize()
			.domain([0, data.length])   
			.range(colors);

		//appending the grids to the canvas
		var grids = canvas.append('g')
						  .attr('id','grid')
						  .attr('transform','translate(150,10)')
						  .selectAll('line')
						  .data(grid)
						  .enter()
						  .append('line')
						  .attr({'x1':function(d,i){ return i*50; },
								 'y1':function(d){ return d.y1; },
								 'x2':function(d,i){ return i*50; },
								 'y2':function(d){ return d.y2; },
							})
						  .style({'stroke':'#adadad','stroke-width':'1px'});

		//formatting of the axis
		var xAxis = d3.svg.axis();
			xAxis
			.orient('bottom')
			.scale(xscale)
			.tickValues(tickVals)
			.tickFormat(formatAxis);

		var yAxis = d3.svg.axis();
			yAxis
			.orient('left')
			.scale(yscale)
			.tickSize(1)
			.tickFormat(function(d,i){return axis_y[i];})  //??
			.tickValues(d3.range(10));

		var y_xis = canvas.append('g')
						  .attr("transform", "translate(150,30)")
						  .attr('id','yaxis')
						  .call(yAxis);

		var x_xis = canvas.append('g')
						  .attr("transform", "translate(150,510)")
						  .attr('id','xaxis')
						  .call(xAxis);

		//storing variables that will be used in creating bar chart
		var keys = [];
		keys = [yscale, colorScale, xscale];

		return keys;
    };
   
   	//function to create the bar chart
    function startBar(metrics, scales){
    	//appending the bars
    	var chart = canvas.append('g')
					.attr("transform", "translate(150,0)")
					.attr('id','bars')
					.selectAll('rect')
					.data(metrics);
					
		chart.enter().append('rect')
					.attr('height',25)
					.attr({'x':0,'y':function(d,i){ return scales[0](i)+19; }})
					.style('fill',function(d,i){ return scales[1](i); })
					.attr('width',function(d){ return 0; });

		//transition
	    var transit = d3.select("svg").selectAll("rect")
			    .data(metrics) 
			    .transition()
			    .duration(2000) 
			    .attr("width", function(d) {return scales[2](d);
			    	 });

		//appending text to the bars
		var transitext = d3.select('#bars')
						.selectAll('text')
						.data(metrics) 
						.enter()
						.append('text')
						.attr({'x':function(d) {return scales[2](d)-200; },'y':function(d,i){ return scales[0](i)+35; }})
						.text(function(d,i){ 
							
							switch(metrics){
								case impressions:
									return metrics[i];
									break;
								case clicks:
									return metrics[i];
									break;
								case cost:
									return '$' + metrics[i];
									break;
								case cpm:
									return d3.format('$.3f')(metrics[i]);
									break;
								case cpc:
									return d3.format('$.4f')(metrics[i]);
									break;
							}})
						.style({'fill':'#fff','font-size':'14px'});
    }

   
    //function to update the chart everytime the metric is changed
	function updateChart(newData, metrics, axisy) {
		//removing the canvas and banner from the previous metric
		canvas.selectAll("g").remove();
		banner0.selectAll('p').remove();

		//creating new axis, bar chart, and banner
		var scales = [];
		scales = startAxis(newData, metrics, axisy);
		startBar(metrics, scales);
		banner(newData);
		//bubbleChart();

	}

	// generate initial chart
	updateChart(topData_cost, cost, campaigns);

	//reading the dropdown value
	var object = document.getElementById("metrics-list");

	object.onchange = function() {
		var selectedValue = document.getElementById("metrics-list").value;

		switch (selectedValue){
			case 'cost':
				var newData = topData_cost;
    			break;
    		case 'impressions':
    			var newData = topData_imp;
    			break;
    		case 'clicks':
    			var newData = topData_clicks;
    			break;
    		case 'cpm':
    			var newData = topData_cpm;
    			break;
    		case 'cpc':
    			var newData = topData_cpc;
    			break;
		}

	  	var metrics = eval(d3.select(this).property('value'));

	  	//storing the campaign names of the top 10 campaigns for y axis
	  	var axis = [];
	  	for (i = 0; i < newData.length; i++){
	        axis.push(newData[i].Campaign);
	    }

	    //updating the chart
	    updateChart(newData, metrics, axis);

	};

}); 



