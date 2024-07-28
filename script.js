// Load the data from the CSV file
d3.csv("china-gdp-cleaned.csv").then(data => {
    console.log(data); // Log the data to verify it's loaded correctly

    // Parse the data
    data.forEach(d => {
        d.Year = +d.Year;
        d.GDP = +d["GDP ( Billions of US $)"];
        d.PerCapita = +d["Per Capita (US $)"];
        d.AnnualChange = +d["Annual % Change"];
    });

    console.log(data); // Log the parsed data

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const yAxis = svg.append("g")
        .attr("class", "y-axis");

    const barGroup = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Year))
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#ff6347");
            svg.append("text")
                .attr("class", "tooltip")
                .attr("x", x(d.Year) + x.bandwidth() / 2)
                .attr("y", y(d.GDP) - 10)
                .attr("text-anchor", "middle")
                .text(d.GDP);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "#69b3a2");
            svg.selectAll(".tooltip").remove();
        });

    function updateBars(metric) {
        y.domain([0, d3.max(data, d => d[metric])]).nice();

        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        barGroup.transition()
            .duration(1000)
            .attr("y", d => y(d[metric]))
            .attr("height", d => height - y(d[metric]))
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#ff6347");
                svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", x(d.Year) + x.bandwidth() / 2)
                    .attr("y", y(d[metric]) - 10)
                    .attr("text-anchor", "middle")
                    .text(d[metric]);
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("fill", "#69b3a2");
                svg.selectAll(".tooltip").remove();
            });
    }

    d3.select(".buttons").selectAll("button")
        .data(["GDP", "PerCapita", "AnnualChange"])
        .enter().append("button")
        .text(d => d)
        .on("click", function(event, d) {
            updateBars(d);
        });

    // Initial render
    updateBars("GDP");
}).catch(error => {
    console.error('Error loading or parsing data:', error);
});
