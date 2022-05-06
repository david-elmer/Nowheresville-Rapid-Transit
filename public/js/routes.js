/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

routes.js written by Chenliang Wang
*/

// add new route
let addRouteForm = document.getElementById('add_route');

addRouteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    let routeNameValue = document.getElementById("route_name").value;
    let startTimeValue = document.getElementById("start_time").value;
    let endTimeValue = document.getElementById("end_time").value;
    let freqValue = document.getElementById("frequency").value;

    // Put data in a javascript object
    let data = {
        name: routeNameValue,
        start_time: startTimeValue,
        end_time: endTimeValue,
        frequency: freqValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_route", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            document.getElementById("route_name").value = '';
            document.getElementById("start_time").value = '';
            document.getElementById("end_time").value = '';
            document.getElementById("frequency").value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})


addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("route_table");

    // Get the location of where to insert new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let routeNameCell = document.createElement("TD");
    let startTimeCell = document.createElement("TD");
    let endTimeCell = document.createElement("TD");
    let freqCell = document.createElement("TD");

    idCell.innerText = newRow.route_id;
    routeNameCell.innerText = newRow.name;
    startTimeCell.innerText = newRow.start_time;
    endTimeCell.innerText = newRow.end_time;
    freqCell.innerText = newRow.frequency;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(routeNameCell);
    row.appendChild(startTimeCell);
    row.appendChild(endTimeCell);
    row.appendChild(freqCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}

