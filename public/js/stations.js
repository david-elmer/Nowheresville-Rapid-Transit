/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

stations.js written by Chenliang Wang
*/

// get the table body for manipulation// add new transfer// add new station
let addStationForm = document.getElementById('add_station');
addStationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    let stationNameValue = document.getElementById("station_name").value;
    let streetOneValue = document.getElementById("street_1").value;
    let streetTwoValue = document.getElementById("street_2").value;
    let cityValue = document.getElementById("city").value;
    let stateValue = document.getElementById("state").value;
    let zipValue = document.getElementById("zip").value;

    let data = {
        name: stationNameValue,
        street_1: streetOneValue,
        street_2: streetTwoValue,
        city: cityValue,
        state: stateValue,
        zip: zipValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_station", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            document.getElementById("station_name").value = '';
            document.getElementById("street_1").value = '';
            document.getElementById("street_2").value = '';
            document.getElementById("city").value = '';
            document.getElementById("state").value = '';
            document.getElementById("zip").value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("station_table");

    // Get the location of where to insert new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let stationNameCell = document.createElement("TD");
    let streetOneCell = document.createElement("TD");
    let streetTwoCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCell = document.createElement("TD");

    idCell.innerText = newRow.station_id;
    stationNameCell.innerText = newRow.name;
    streetOneCell.innerText = newRow.street_1;
    streetTwoCell.innerText = newRow.street_2;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    zipCell.innerText = newRow.zip;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(stationNameCell);
    row.appendChild(streetOneCell);
    row.appendChild(streetTwoCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}

