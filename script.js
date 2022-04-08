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
        top: 40,
        right: 20,
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
        .call(xAxis)
    const yAxis = d3.axisLeft(yScale)
    d3.select('.d3-content')
        .append('g')
        .attr('transform', `translate( ${margin.left}, 0)`)
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
        .text("Mean Temperature (°C)");

    //title and subtitle
    d3.select('.d3-content')
        .append("text")
        .attr("x", w / 2)
        .attr("y", margin.top + 25)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Monthly Mean Temperature Anomalies")

    d3.select('.d3-content')
        .append("text")
        .attr("x", w / 2)
        .attr("y", margin.top + 50)
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
            .attr('stroke', 'black')
            .attr('stroke-width', '2px')
            

    //need to learn how to add tooltips to path
}

generateLineChart()
