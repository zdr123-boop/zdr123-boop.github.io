// Define data and parameters
const data = [
    { year: 2010, value: 50 },
    { year: 2011, value: 55 },
    { year: 2012, value: 60 },
    { year: 2013, value: 65 },
    { year: 2014, value: 70 },
    { year: 2015, value: 75 }
];

const scenes = [
    { year: 2010, message: "In 2010, the value was 50." },
    { year: 2012, message: "By 2012, the value increased to 60." },
    { year: 2015, message: "In 2015, the value reached 75." }
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
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
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
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#69b3a2")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#ff6347");
        svg.append("text")
            .attr("class", "tooltip")
            .attr("x", x(d.year) + x.bandwidth() / 2)
            .attr("y", y(d.value) - 10)
            .attr("text-anchor", "middle")
            .text(d.value);
    })
    .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg.selectAll(".tooltip").remove();
    });

// Initialize scene index
let currentSceneIndex = 0;

function updateScene() {
    const scene = scenes[currentSceneIndex];

    svg.selectAll(".bar")
        .attr("fill", d => d.year === scene.year ? "#ff6347" : "#69b3a2");

    svg.selectAll(".annotation").remove();
    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(scene.year) + x.bandwidth() / 2)
        .attr("y", y(data.find(d => d.year === scene.year).value) - 10)
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

