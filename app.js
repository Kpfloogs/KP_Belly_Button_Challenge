// creating a constant path for the URL connected with the assignemnt data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// looking at arrays in the console log:
// d3.json(url).then(function(data) {
//     console.log(data);
//   });
 
//creating a function to retrieve data for bar chart

function barChart(sample) {
    //calling the data from the json
    d3.json(url).then((data) => {
    let plotData = data.samples;
    //creating a letible filter for iteration
    let plotID = plotData.filter(sampleID => sampleID.id == sample)[0];

    //calling out specific parts of the data for the bar chart
    let sample_values = plotID.sample_values;
    let otu_ids = plotID.otu_ids;
    let otu_labels = plotID.otu_labels;

    //creating the bar chart
    let trace1 = {
        //slicing the data to only dislay the first 10 bacteria
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    };

    Plotly.newPlot("bar", [trace1])
    
}
)};

//creating a function to retrieve data for bubble graph, repeating data retrieval as in the 
// bar chart function

function bubbleChart(sample) {
    d3.json(url).then(function(data) {
    let plotData = data.samples;
    let plotID = plotData.filter(sampleID => sampleID.id == sample)[0];

    let sample_values = plotID.sample_values;
    let otu_ids = plotID.otu_ids;
    let otu_labels = plotID.otu_labels;

    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers", //signifies the plot as a bubble graph
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Jet',
        }

    };

    Plotly.newPlot("bubble", [trace2]);   
}
)};
    
//creating a function to retrieve data for demographic info box - the hardest part of this assignment :D  

function demoBox(sample) {
    // retrieving data, similar to the graphs
    d3.json(url).then(function(data) {
        let demoData = data.metadata;
        let demoID = demoData.filter(sampleID => sampleID.id == sample)[0];

        //making sure to reset the info box with each change of the dashboard
        d3.select('#sample-metadata').html("");

        //pulling the array (dictionary) keys and their values from each iteration of the dataset
        Object.entries(demoID).forEach(([key, value]) =>
            //calling out the demo box from the html
            d3.select("#sample-metadata")
            //adding the key and value pairs with each dashboard change
            .append("p").text(`${key}: ${value}`));

    });
};

// dropdown menu functionality
function updateDash() {
    //selecting the html code that signifies the drop down menu
    let dropdownMenu = d3.select('#selDataset');

    //retrieving the data from the "names" array
    d3.json(url).then(function(data) {
        let nameIDs = data.names;
        //iterating through all the IDs
        nameIDs.forEach((ID) => {
            //appending the dropdown menu with the html code
            dropdownMenu.append("option")
            .text(ID) //value that should be displayed in the menu
            .property("value", ID) // property = the new ID and connecting it with the "this.value" in
            //the html
        });

        //creating an iteration for each component to update with the dash to display specific id info
        let person1 = nameIDs[0];

        demoBox(person1);
        barChart(person1);
        bubbleChart(person1);
        
    });
    
};
//calling out the event in the html of "optionChanged" which utilizes "this" in the html so that
//when the dropdown menu changes IDs, the dahsboard will fully update with the correct singular ID info
function optionChanged(item) {
    demoBox(item);
    barChart(item);
    bubbleChart(item);
};

//finally updating the dashboard in real time by calling the function
updateDash();