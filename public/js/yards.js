/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

yards.js written by David Elmer
*/

// get the table body for manipulation
let table_body = document.getElementById('table_body');

// create event listeners for each delete button
document.addEventListener('DOMContentLoaded', function(){
    // add event listener for the form submit button
    document.getElementById('yards_insert').addEventListener('click', insertRequest);
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
    row.id = data.yard_id;

    // id
    let yard_id = document.createElement('td');
    yard_id.textContent = data.yard_id;
    row.appendChild(yard_id);

    // name
    let name = document.createElement('td');
    name.textContent = data.name;
    row.appendChild(name);

    // street
    let street = document.createElement('td');
    street.textContent = data.street;
    row.appendChild(street);

    // total_employee
    let total_employee = document.createElement('td');
    total_employee.textContent = data.total_employee;
    row.appendChild(total_employee);

    // curr_occupancy
    let curr_occupancy = document.createElement('td');
    curr_occupancy.textContent = data.curr_occupancy;
    row.appendChild(curr_occupancy);

    // max_occupancy
    let max_occupancy = document.createElement('td');
    max_occupancy.textContent = data.max_occupancy;
    row.appendChild(max_occupancy);

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
    
    // delete button
    // create td and button
    let delete_col = document.createElement('td');
    let delete_button = document.createElement('input');
    delete_button.type = 'button';
    delete_button.name = data.yard_id;
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
    document.getElementById('name').value = '';
    document.getElementById('street').value = '';
    document.getElementById('total_employee').value = '';
    document.getElementById('curr_occupancy').value = '';
    document.getElementById('max_occupancy').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('zip').value = '';
}


// ---------- INSERT REQUEST ----------
function insertRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    let data = {
        name            :   document.getElementById('name').value,
        street          :   document.getElementById('street').value,
        total_employee  :   document.getElementById('total_employee').value,
        curr_occupancy  :   document.getElementById('curr_occupancy').value,
        max_occupancy   :   document.getElementById('max_occupancy').value,
        city            :   document.getElementById('city').value,
        state           :   document.getElementById('state').value,
        zip             :   document.getElementById('zip').value
    }
        
    // set up AJAX request
    let req = new XMLHttpRequest;
    req.open('POST', '/yards', true);
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

function deleteRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    let data = {id: this.name};
    
    // set up AJAX request
    let req = new XMLHttpRequest;
    req.open('DELETE', '/yards', true);
    req.setRequestHeader('Content-Type', 'application/json');
    
    // tell AJAX how to resolve
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let affected_rows = JSON.parse(req.responseText)
            if (affected_rows) {
                deleteRow(data.id);
            }
        } else if (req.readyState == 4 && req.status != 200) {
            console.log('There was an error deleting Yard ' + data.id + '.');
        }
    }

    // send the request and wait for the response
    req.send(JSON.stringify(data));
}