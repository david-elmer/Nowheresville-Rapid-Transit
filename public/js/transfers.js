/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

transfers.js written by Chenliang Wang
*/

// get the table body for manipulation// add new transfer
let addTransferForm = document.getElementById('add_transfer');
addTransferForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    let stationValue = document.getElementById("station_id").value;
    let routeValue = document.getElementById("route_id").value;

    let data = {
        station: stationValue,
        route: routeValue
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_transfer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            document.getElementById("station_id").value = '';
            document.getElementById("route_id").value = '';
            
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("transfer_table");

    // Get the location of where to insert new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let stationCell = document.createElement("TD");
    let routeCell = document.createElement("TD");

    stationCell.innerText = newRow.station;
    routeCell.innerText = newRow.route;

    // Add the cells to the row 
    row.appendChild(stationCell);
    row.appendChild(routeCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}

