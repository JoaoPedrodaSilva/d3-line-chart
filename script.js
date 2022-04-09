async function generateLineChart() {
    //data
    const dataSet = await d3.json("https://pkgstore.datahub.io/core/global-temp/annual_json/data/529e69dbd597709e36ce11a5d0bb7243/annual_json.json")
    
    //accessors    
    const xAccessor = d => d.Year
    const yAccessor = d => d.Mean

    //dimensions
    const w = 600
    const h = 520
    const margin = {
        top: 60,
        right: 60,
        bottom: 45,
        left: 60
    }

    //scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => xAccessor(d)),
                d3.max(dataSet, d => xAccessor(d))])
        .range([margin.left, w - margin.right])
    const yScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => yAccessor(d)),
                d3.max(dataSet, d => yAccessor(d))])
        .range([h - margin.bottom, margin.top])

    //base temperature colors
    const hot = yScale(d3.max(dataSet, d => yAccessor(d)))
    d3.select('.d3-content')
        .append('rect')
        .attr('width', w - margin.left - margin.right)
        .attr('height', h - margin.top - margin.bottom)
        .attr('x', margin.left)
        .attr('y', hot)
        .attr('fill', '#EEDDE0 ')
        
    const cold = yScale(0)
    d3.select('.d3-content')
        .append('rect')
        .attr('width', w - margin.left - margin.right)
        .attr('height', h - 380)
        .attr('x', margin.left)
        .attr('y', cold)
        .attr('fill', '#e0f3f3')    

    //axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
    d3.select('.d3-content')
        .append('g')
        .attr('transform', `translate(0, ${h - margin.bottom})`)
        .style("font-size", "12px")       
        .call(xAxis)
    const yAxis = d3.axisLeft(yScale)
    d3.select('.d3-content')
        .append('g')
        .attr('transform', `translate( ${margin.left}, 0)`)
        .style("font-size", "12px")
        .call(yAxis)
    
    //labels
    d3.select('.d3-content')
        .append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (h) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");
    
    d3.select('.d3-content')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(h / 2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Mean Temperature Variance (°C)");

    //title and subtitle
    d3.select('.d3-content')
        .append("text")
        .attr("x", w / 2)
        .attr("y", margin.top - 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Monthly Mean Temperature Anomalies")

    d3.select('.d3-content')
        .append("text")
        .attr("x", w / 2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("in degrees Celsius relative to a base period")    

    //line
    const line = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))
    
    d3.select('.d3-content')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .classed("svg-content", true)
            .append('path')
            .attr('d', line(dataSet))
            .attr('fill', 'none')
            .attr('stroke', 'lightsteelblue')
            .attr('stroke-width', '2px')
            

    //interaction
    d3.select('.d3-content')
        .append("rect")
        .attr("class", "listening-rect")
        .attr("width", w - margin.right - margin.left)
        .attr("height", h - margin.top - margin.bottom)
        .attr('x', margin.left)
        .attr('y', margin.top)
        .style('fill', 'transparent')
        .on("mousemove", onMouseMove)
        .on("mouseleave", () => {
            tooltip.style("opacity", 0)
            tooltipCircle.style("opacity", 0)
            tooltipYear.style("opacity", 0)
            tooltipVariance.style("opacity", 0)
        })

    function onMouseMove(e) {
        const mousePosition = d3.pointer(e)
        const hoveredDate = xScale.invert(mousePosition[0])
        const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
        const closestIndex = d3.scan(
            dataSet,
            (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
        )
        const closestDataPoint = dataSet[closestIndex]
        const closestXValue = xAccessor(closestDataPoint)
        const closestYValue = yAccessor(closestDataPoint)

        tooltip.style("opacity", 1)
        tooltipCircle
            .attr("cx", xScale(closestXValue))
            .attr("cy", yScale(closestYValue))
            .style("opacity", 1)
        tooltipYear
            .attr("x", xScale(closestXValue) - 50)
            .attr("y", yScale(closestYValue) - 50)
            .style("opacity", 1)
            .text('Year: ' + xAccessor(closestDataPoint))
            .attr('font-size', '16px')
        tooltipVariance
            .attr("x", xScale(closestXValue) - 50)
            .attr("y", yScale(closestYValue) - 25)
            .style("opacity", 1)
            .text('Variance: ' + yAccessor(closestDataPoint).toFixed(2))
            .attr('font-size', '16px')
  }
  
const tooltip = d3.select(".tooltip")
const tooltipCircle = d3.select(".d3-content")
    .append("circle")
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("stroke-width", 1)
    .style("opacity", 0)
const tooltipYear = d3.select(".d3-content")
    .append('g')
    .append('text')
    .style("opacity", 0)
const tooltipVariance = d3.select(".d3-content")
    .append('g')
    .append('text')
    .style("opacity", 0)

}

generateLineChart()
