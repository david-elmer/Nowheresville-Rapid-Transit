/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

train_add.js written by Chenliang Wang
*/

let addTrainForm = document.getElementById('add_train');
addTrainForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    let carNumValue = document.getElementById("train_car").value;
    let capacityValue = document.getElementById("capacity").value;
    let routeValue = document.getElementById("route_id").value;
    let yardValue = document.getElementById("yard_id").value;

    let data = {
        car: carNumValue,
        car_capacity: capacityValue,
        route: routeValue,
        yard: yardValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_train", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            document.getElementById("train_car").value = '';
            document.getElementById("capacity").value = '';
            document.getElementById("route_id").value = '';
            document.getElementById("yard_id").value = '';

            // Reload page so route_id and yard_id show as names
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
    let currentTable = document.getElementById("train_table");

    // Get the location of where to insert new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let carNumCell = document.createElement("TD");
    let capacityCell = document.createElement("TD");
    let routeCell = document.createElement("TD");
    let yardCell = document.createElement("TD");

    idCell.innerText = newRow.train_id;
    carNumCell.innerText = newRow.car;
    capacityCell.innerText = newRow.car_capacity;
    routeCell.innerText = newRow.route;
    yardCell.innerText = newRow.yard;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(carNumCell);
    row.appendChild(capacityCell);
    row.appendChild(routeCell);
    row.appendChild(yardCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}

