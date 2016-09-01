 function bubbleChart(){
    	var diameter = 500, //max size of the bubbles
		color_bubble    = d3.scale.category20b(); //color category

		var bubble = d3.layout.pack()
		    .sort(null)
		    .size([diameter, diameter])
		    .padding(1.5);



		//scale for the bubbles
		// Set the dimensions of the canvas / graph

		var margin = {top: 30, right: 20, bottom: 30, left: 50},
			width = 600 - margin.left - margin.right,
			height = 270 - margin.top - margin.bottom;

		var svg_bubble = d3.select("#bubble")
		    .append("svg")
				.attr("width", 1100)
				.attr("height", 1100)
			.append("g")
				.attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

		//performance data
		var performance = [{
								"performance": "Total Cost",
								"figure": "$679,605.25",
								"cx": 500,
								"cy": 500,
								"y": 350,
								"value": 200
							},
							{
								"performance": "Total Clicks",
								"figure": "767,900",
								"cx": 200,
								"cy": 500,
								"y": 450,
								"value": 100
							},
							{
								"performance": "Total Impressions",
								"figure": "132,529,747",
								"cx": 500,
								"cy": 800,
								"y": 750,
								"value": 100
							},
							{
								"performance": "Average CPC",
								"figure": "$0.755",
								"cx": 800,
								"cy": 500,
								"y": 450,
								"value": 100
							},
							{
								"performance": "Average CPM",
								"figure": "$4.373",
								"cx": 500,
								"cy": 200,
								"y": 150,
								"value": 100,
							}
		];
		/*
		for (i = 0; i < 5; i++){
			performance[i]["figure"] = topData_cost[i].Clicks;
		}
		*/


		

		var figure = ["$679,605.25", "767,900", "132,529,747", "$4.373"]

		//what for?
		var nodes = bubble.nodes({children:performance})
					.filter(function(d) { return !d.children; });

		//append the bubbles
		var bubbles = svg_bubble.append("g")
		    .attr("transform", "translate(0,0)")
		    .attr("id", "bub")
		    .selectAll(".bubble")
		    .data(nodes)
		    .enter();

		bubbles.append("circle")
		    .attr("r", function(d){return d.value;})
		    .attr("cx", function(d){ return d.cx; })
		    .attr("cy", function(d){ return d.cy; })
		    .style("fill", function(d) { return color_bubble(d.value); });

		bubbles.append("text")
		    .attr("x", function(d){ return d.cx; })
		    .attr("y", function(d){ 
		    						if (d.performance == "Total Cost") {
		    							return d.cy - 130;
		    						}else{
		    							return d.cy - 50;} })
		    .attr("text-anchor", "middle")
		    .text(function(d){ return d["performance"]; })
		    .style("font-size", function(d){
		    								if (d.performance == "Total Cost"){
		    									return "25px";
		    								}else{return "18px";}
		    })
		    .style({
		        "fill":"white", 
		        "font-family":"Helvetica Neue, Helvetica, Arial, san-serif"
		    });

		bubbles.append("text")
		    .attr("x", function(d){ return d.cx; })
		    .attr("y", function(d){ return d.cy + 10; })
		    .attr("text-anchor", "middle")
		    .text(function(d){ return d["figure"]; })
		    .style("font-size", function(d){
		    								if (d.performance == "Total Cost"){
		    									return "40px";
		    								}else{return "30px";}
		    })
		    .style({
		        "fill":"white", 
		        "font-family":"Helvetica Neue, Helvetica, Arial, san-serif"
		    });

}