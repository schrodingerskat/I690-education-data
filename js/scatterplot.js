// Build bar charts comparing school, state, and national averages
// To add more function parameters (e.g., selected state/school),
// add them to the beginning of the list.
// Call with createVis("bars", <selection variables>);

/*Global varaibles*/
// var state_data;
// var national_data;
var filtered_data_global;
var svg_global;
var school_data_global;
var x_global;
var y_global;


// Build scatterplot for a state based on school data
// Call with createVis("scatter", selectedState);
var buildScatter = function(selectState, school_data) {

  school_data_global = school_data;

  // margins
  var margin = {top: 25, right: 0, bottom: 55, left: 80},
      width = 700 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3v4.select("#scattercanvas")
      .append("div")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 750")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);

      svg_global = svg;

    var x = d3v4.scaleLinear()
        .range([0,width]);

    var y = d3v4.scaleLinear()
        .range([height,0]);

    x.domain(d3v4.extent(school_data,
        function(d) { return d.median_earnings; })).nice();
    y.domain(d3v4.extent(school_data,
        function(d) { return d.mean_debt_graduated; })).nice();

    // Filter to show selected state
    filtered_data = school_data.filter(function(d,i,arr) {
        if (selectState == d.state) {
            return d.state;
        } else {
            return false;
        }
    });
      x_global = x;
      y_global = y;
      filtered_data_global = filtered_data;
      //Creates the dropdown with only the schools in the selected state

      //Retrieves the schools in the state.
      // var schools = populateSchoolsFromFilteredData(filtered_data);

      //Helps to fill in all of the schools in the current selection
      // populateSelector(schools);

      addChangeEvent();
      // console.log("we have updated the selector");

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3v4.axisBottom(x)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }))
        .selectAll("text")
          .attr("y", 10)
          .attr("x", -80)
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "start");

      svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height-5)
        .style("text-anchor", "end")
        .text("Median earnings");

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0)")
          .call(d3v4.axisLeft(y)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }));

      svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Average debt");


      // creates dropdown menu for each state
      var dropDown = d3.select("#school-selector").append("select").data(filtered_data)
                        .attr("class", "school-list");

      var options = dropDown.selectAll("option")
         .data(filtered_data)
       .enter().append("option")
          .text(function (d) { return d.college; })
          .attr("value", function (d) { return d.college; });

      dropDown.on("change", dropClick);


      // adds select a school option to the menus
      $('option:first-child').before('<option>Select a school:</option>');
      $('option:first-child').val("show-all");
      $('.school-list').val("show-all");


      svg.selectAll(".dot")
        .data(filtered_data)
      .enter().append("circle")
        .attr("id", function(d) { return d.college })
        .attr("class", "dot")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.median_earnings); })
        .attr("cy", function(d) { return y(d.mean_debt_graduated); })
        .attr("stroke", "#fff")
        .on("mouseover", scatterHover)
        .on("click", scatterHover);


      // console.log("I have reached this part");

      // selectSchool("Maine Maritime Academy");
      updateRegression(filtered_data);

  };


  function buildBarCharts (d, state_data, national_data) {
    console.log(d.median_earnings);
    console.log(state_data);
    console.log(national_data);
  };

  /*Helper functions*/
  function scatterHover(d) {
    console.log(d);
    details(d);
    $('.dot').css('fill', '#47b4f2').attr("r", 10);
    $(this).css('fill', "#1f3f48").attr("r", 15);
    // buildBarCharts(d, state_data, national_data);
  }

  function dropClick(d) {
    key = this.value;
    console.log(key);
    d3.selectAll('.dot')
    .attr('r', function(d, i) {
            if (d.college == key)
            {return 15;}
            else { return 10}
        })
    .style('fill', function(d, i) {
            if (d.college == key)
            {return "#1f3f48";}
            else { return "#47b4f2"}
        });
    d3.select('#schoolinfo').text(key);
    }

  function details (d) {
    var details = "<h3>" + d.college + "</h3><span class='category'>Median earnings:</span> $";
    details += d.median_earnings.toLocaleString() + "</br><span class='category'>Average debt:</span> $";
    details += d.mean_debt_graduated.toLocaleString() + "</br><span class='category'>Average net price:</span> $";
    details += d.mean_price.toLocaleString() + "</br><span class='category'>Graduation rate:</span> ";
    details += (d.completion_rate*100).toFixed(2) + "%</br><span class='category'>Repayment rate:</span> ";
    details += (d.repayment_rate*100).toFixed(2) + "%";
    document.getElementById('schoolinfo').innerHTML = details;
  }


    // function populateSchoolsFromFilteredData(filtered_data){
    // var schools = [];
    // var j = 0;
    // for (var i = 0; i < filtered_data.length; i++){
    //     schools[j] = filtered_data[i].college;
    //     j++;
    //  }
    //   return schools;
    // }
    //
    //
    // function populateSchools(currentState, school_data){
    // var schools = [];
    // var j = 0;
    // for (var i = 0; i < school_data.length; i++){
    //   if (school_data[i].state == currentState){
    //     schools[j] = school_data[i].college;
    //     j++;
    //   }else{
    //     console.log("It didnt match");
    //   }
    //  }
    //   return schools;
    // }
  //Helps to populate the selector
  // function populateSelector(schools){
  //   var selector = document.getElementById('school-selector');
  //   // console.log(selector);
  //   var newOptions = "<select class='selectpicker' id = 'school-selector'>";
  //   newOptions += "<option>" + "Show all" + "</option>";
  //
  //   for (var i = 0; i < schools.length; i++) {
  //     newOptions += "<option>" + schools[i] + "</option>";
  //   }
  //
  //   newOptions += "</select>";
  //   document.getElementById('school-selector').innerHTML = newOptions;
  //
  // }

  // $('select').on('change', function(filtered_data){
  //   console.log("option click");
  //   scatterHover();
  // });



  //Adds the event listener to monitor any changes in the selection
  function addChangeEvent(){
    var selectEvent = document.getElementById('school-selector');
    //The line below adds the event to the map! I do not understand why this is happening?
    //selectEvent.addEventListener("change", alert(this.value));
    // console.log("I tried to add the event");
  }

      // function selectSchool(selectedSchool){
      //
      //
      //   //Initialization of variables
      //   var filtered_data = filtered_data_global;
      //   var svg = svg_global;
      //   var school_data = school_data_global;
      //   var x = x_global;
      //   var y = y_global;
      //
      //
      //   console.log(selectedSchool);
      //
      //   if (selectedSchool === "Show all"){
      //     svg.selectAll(".dot")
      //       .data(filtered_data)
      //     .enter().append("circle")
      //       .attr("class", "dot")
      //       .attr("r", 10)
      //       .attr("cx", function(d) { return x(d.median_earnings); })
      //       .attr("cy", function(d) { return y(d.mean_debt_graduated); })
      //       .attr("stroke", "#fff")
      //       .on("mouseover", scatterHover)
      //       .on("click", scatterHover);
      //   }
      //   else{
      //     var circles = svg.selectAll(".dot");
      //     //Shows the required circle in orange
      //     circles.remove();
      //
      //     svg.selectAll(".dot")
      //         .data(filtered_data)
      //       .enter().append("circle")
      //         .attr("class", "dot")
      //         .attr("r", 10)
      //         .attr("cx", function(d) { return x(d.median_earnings); })
      //         .attr("cy", function(d) { return y(d.mean_debt_graduated); })
      //         .attr("stroke", "#fff")
      //         .style("fill", function(d) { if(d.college === selectedSchool) return "#1f3f48"; })
      //         .on("mouseover", scatterHover)
      //         .on("click", scatterHover);
      //
      //   }
      // }

// Add a regression line
function updateRegression(schools) {
    var linear_model = ss.linearRegression(schools.map(function(d) {
        return [d.median_earnings, d.mean_debt_graduated];
    }));

    var regression_function = ss.linearRegressionLine(linear_model);
    var reg_line = svg_global.selectAll(".regression").data([schools]);
    reg_line.exit().remove();

    reg_line.enter().append("line")
        .attr("class", "regression")
        .attr("x1", x_global(0))
        .attr("y1", y_global(regression_function(0)))
        .attr("x2", x_global(85000))
        .attr("y2", y_global(regression_function(85000)))
        .attr("clip-path", "url(#clip)")
        .style("stroke", "#1f3f48")
        .style("opacity", 0)
        .style("stroke-dasharray", "10,8")
        .style("stroke-width", "2px")
        .transition()
            .style("opacity", 1);
}
