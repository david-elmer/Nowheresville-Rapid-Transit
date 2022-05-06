/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

employees.js written by David Elmer
*/

// get the table body for manipulation
let table_body = document.getElementById('table_body');

// create event listeners for each delete button
document.addEventListener('DOMContentLoaded', function(){
    // add event listener for the form submit button
    document.getElementById('employees_insert').addEventListener('click', insertRequest);
    // get the table body in order to get an array of rows to traverse to find delete buttons
    let rows = table_body.children;
    // for each row in the table body
    for (let row of rows) {
        let td = row.lastElementChild;
        let button = td.firstElementChild;
        // add the event listener to call for the delete request
        button.addEventListener('click', deleteRequest)
    }
});


// function adds row with data passed to it from the insert request
function insertRow(data) {
    // create a new table row and populate it with data from insert request
    // create a row
    let row = document.createElement('tr');
    row.id = data.employee_id;

    // id
    let employee_id = document.createElement('td');
    employee_id.textContent = data.employee_id;
    row.appendChild(employee_id);

    // first_name
    let first_name = document.createElement('td');
    first_name.textContent = data.first_name;
    row.appendChild(first_name);

    // last_name
    let last_name = document.createElement('td');
    last_name.textContent = data.last_name;
    row.appendChild(last_name);

    // street
    let street = document.createElement('td');
    street.textContent = data.street;
    row.appendChild(street);

    // city
    let city = document.createElement('td');
    city.textContent = data.city;
    row.appendChild(city);

    // state
    let state = document.createElement('td');
    state.textContent = data.state;
    row.appendChild(state);

    // zip
    let zip = document.createElement('td');
    zip.textContent = data.zip;
    row.appendChild(zip);

    // dob
    let dob = document.createElement('td');
    dob.textContent = data.dob;
    row.appendChild(dob);

    // train
    let train = document.createElement('td');
    train.textContent = data.train;
    row.appendChild(train);

    // yard
    let yard = document.createElement('td');
    yard.textContent = data.yard;
    row.appendChild(yard);

    // station
    let station = document.createElement('td');
    station.textContent = data.station;
    row.appendChild(station);
    
    // delete button
    // create td and button
    let delete_col = document.createElement('td');
    let delete_button = document.createElement('input');
    delete_button.type = 'button';
    delete_button.name = data.employee_id;
    delete_button.value = 'Delete';
    // add event listener to button
    delete_button.addEventListener('click', deleteRequest);
    // add td and button to row
    delete_col.appendChild(delete_button);
    row.appendChild(delete_col);

    // add row to table
    table_body.appendChild(row);
}


// function removes the row with the id passed to it from the table body
function deleteRow(id) {
    let row = document.getElementById(id);
    table_body.removeChild(row);
}


// function clears the input form
function clearForm() {
    document.getElementById('first_name').value = '';
    document.getElementById('last_name').value = '';
    document.getElementById('street').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('zip').value = '';
    document.getElementById('dob').value = '';
    let train_select = document.getElementById('train_select').firstElementChild;
    train_select.selected = true;
    let yard_select = document.getElementById('yard_select').firstElementChild;
    yard_select.selected = true;
    let station_select = document.getElementById('station_select').firstElementChild;
    station_select.selected = true;
}


// ---------- INSERT REQUEST ----------
function insertRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    let data = {
        first_name      :   document.getElementById('first_name').value,
        last_name       :   document.getElementById('last_name').value,
        street          :   document.getElementById('street').value,
        city            :   document.getElementById('city').value,
        state           :   document.getElementById('state').value,
        zip             :   document.getElementById('zip').value,
        dob             :   document.getElementById('dob').value,
        train           :   document.getElementById('train_select').value,
        yard            :   document.getElementById('yard_select').value,
        station         :   document.getElementById('station_select').value
    }
        
    // set up AJAX request
    let req = new XMLHttpRequest;
    req.open('POST', '/employees', true);
    req.setRequestHeader('Content-Type', 'application/json');
    
    // tell AJAX how to resolve
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let result = JSON.parse(req.responseText)
            if (result) {
                insertRow(result[0]);
                clearForm();
            }
        } else if (req.readyState == 4 && req.status != 200) {
            console.log('There was an error inserting into Yards.');
        }
    }

    // send the request and wait for the response
    req.send(JSON.stringify(data));
}

// ---------- DELETE REQUEST ----------
function deleteRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    let data = {id: this.name};
    
    // set up AJAX request
    let req = new XMLHttpRequest;
    req.open('DELETE', '/employees', true);
    req.setRequestHeader('Content-Type', 'application/json');
    
    // tell AJAX how to resolve
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let affected_rows = JSON.parse(req.responseText)
            if (affected_rows) {
                deleteRow(data.id);
            }
        } else if (req.readyState == 4 && req.status != 200) {
            console.log('There was an error deleting Employee ' + data.id + '.');
        }
    }

    // send the request and wait for the response
    req.send(JSON.stringify(data));
}