"use strict";

console.log("hi");
function DrawBar(dataset) {
  const margin = { top: 40, right: 30, bottom: 50, left: 80 },
    width = 800,
    height = 400;
  // console.log(dataset);

  let minDate = dataset[0][0].substr(0, 4);
  minDate = new Date(minDate);

  var yearsDate = dataset.map(function (item) {
    return new Date(item[0]);
  });

  var maxDate = new Date(d3.max(yearsDate));

  var xAxisScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), maxDate])
    .range([0, width]);

  const yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d[1];
      }),
    ])
    .range([height, 0]);

  const xAxis = d3.axisBottom().scale(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  const tooltip = d3
    .select("body")
    .append("div")

    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("padding", "4px")
    .style("background", "#fff")
    .style("border", "1px solid #000");

  const mouseoverHandler = (d, data) => {
    // console.log(data);
    tooltip.style("opacity", 0.8);
    tooltip

      .html(
        "<p> Date: " + data[0] + "</p>" + "<p> Billions: $" + data[1] + "</p>"
      )
      .attr("data-date", data[0])
      .attr("data-gdp", data[1]);

    d3.select(this).style("opacity", 0.1);
  };

  const mouseoutHandler = (d) => {
    tooltip.style("opacity", 0);
    d3.select("opacity", 1);
  };

  const mouseMoving = (d) => {
    const mouse = d3.pointer(d);
    tooltip
      .style("top", mouse[1] + 30 + "px")
      .style("left", mouse[0] + 130 + "px");

    d3.select(this).style("opacity", 0.8);
  };

  const svg = d3
    .select("#barGraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph-svg-component")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .selectAll("bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("data-date", function (d, i) {
      // console.log(d[0]);
      return d[0];
    })
    .attr("data-gdp", (d, i) => {
      return d[1];
    })
    .attr("class", "bar")
    .style("fill", "darkblue")
    .attr("x", (d, i) => i * (width / dataset.length))
    .attr("y", (d) => yAxisScale(d[1]))
    .attr("width", width / dataset.length)
    .attr("height", (d) => height - yAxisScale(d[1]))
    .on("mouseover", mouseoverHandler)
    .on("mousemove", mouseMoving)
    .on("mouseout", mouseoutHandler);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -120)
    .attr("y", 20)
    .text("GDP (in billions)");

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "y axis")

    .call(yAxis);
}

async function fetchData() {
  const res = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );
  const data = await res.json();
  // console.log(data.data);
  const dataset = data.data;
  DrawBar(dataset);
}
fetchData();
