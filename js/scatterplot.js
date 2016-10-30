var buildScatter = function(selectState) {

  console.log(selectState);

  // margins
  var margin = {top: 30, right: 250, bottom: 130, left: 150},
      width = 900 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3.select("#scattercanvas")
      .append("div")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 700")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);


  // var designation = ["Main", "Branch"];
  // var designation_color = ["#47b4f2","#b0c422"];

  // load data
  var institutionFile = "data/institutional-data.csv";
  d3.csv(institutionFile,
      function(d) {
          return {
              college: d.college_name,
              state: d.state,
              college_type: d.type_des,
              campus_type: d.campus_des,
              median_income: +d.median_family_income,
              mean_price: +d.avg_net_price,
              median_earnings: +d.median_earnings,
              completion_rate: +d.completion_rate,
              mean_debt_withdrawn: +d.debt_withdrew,
              mean_debt_graudated: +d.debt_graduated,
              repayment_rate: +d.repayment_rate
          };
      },
      function(error, data) {
          if (error != null) {
              alert("Uh-oh, something went wrong. Try again?");
          } else {
                var filtered_data = data.filter(function(d,i,arr) {
                if (selectState == d.state) {
                  return d.state;
                } else {
                  return false;
                }
              });
              plot_data(filtered_data);
          }
      });

  var plot_data = function(data) {
      console.log(data);

      x.domain([0, d3.max(data, function(d) { return d.median_earnings; })]).nice();
      y.domain([0, d3.max(data, function(d) { return d.mean_debt_graudated;  })]).nice();

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("y", 5)
      .attr("x", -37)
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "start")
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Median earnings");

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0)")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Average debt")

          svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", function(d) { return "dot " + d.campus_type })
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.median_earnings); })
            .attr("cy", function(d) { return y(d.mean_debt_graudated); })
            .attr("r", function(d) { if (d.completion_rate === 0) { return 5 } else { return (d.completion_rate)*20}});

      // svg.selectAll("text")
      //     .data(data)
      //   .enter().append("text")
      //     .text(function (d) { return d.median_earnings });

  }




};

$(".state")
.on('click', function(){
  $this = this;
  var stateClass = $(this).attr('id');
  var enterState = '<div class="hidden-xs sf sf-' + stateClass.toLowerCase() + '"></div><h2>' + stateClass + '</h2>';
  $('.scatter').html('<div id="scattercanvas"></div>');
  $('#schoolinfo').html(enterState);
  buildScatter(stateClass);
  $('.bottom-row').addClass('bottom-border');


// })
// .one('click', function(){
//   $this = this;
//   var stateClass = $(this).attr('id');
//   buildScatter(stateClass);
});
