// Load the data from the CSV file
d3.csv("china-gdp-gross-domestic-product.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d.GDP = +d.GDP;
    });

    // Define the scenes for narrative visualization
    const scenes = [
        { year: 2012, message: "In 2012, China's GDP was 8.53 trillion USD." },
        { year: 2015, message: "In 2015, China's GDP grew to 11.06 trillion USD." },
        { year: 2020, message: "By 2020, China's GDP reached 14.34 trillion USD." },
        { year: 2022, message: "In 2022, China's GDP is estimated to be 17.73 trillion USD." }
    ];

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
        .domain([0, d3.max(data, d => d.GDP)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Year))
        .attr("y", d => y(d.GDP))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.GDP))
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

    let currentSceneIndex = 0;

    function updateScene() {
        const scene = scenes[currentSceneIndex];

        svg.selectAll(".bar")
            .attr("fill", d => d.Year === scene.year ? "#ff6347" : "#69b3a2");

        svg.selectAll(".annotation").remove();
        svg.append("text")
            .attr("class", "annotation")
            .attr("x", x(scene.year) + x.bandwidth() / 2)
            .attr("y", y(data.find(d => d.Year === scene.year).GDP) - 20)
            .attr("text-anchor", "middle")
            .text(scene.message);
    }

    d3.select("body").append("div")
        .attr("class", "buttons")
        .selectAll("button")
        .data(["Previous", "Next"])
        .enter().append("button")
        .text(d => d)
        .on("click", function(event, d) {
            if (d === "Next" && currentSceneIndex < scenes.length - 1) {
                currentSceneIndex++;
            } else if (d === "Previous" && currentSceneIndex > 0) {
                currentSceneIndex--;
            }
            updateScene();
        });

    updateScene();
});
