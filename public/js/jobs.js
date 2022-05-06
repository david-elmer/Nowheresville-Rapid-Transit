/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

jobs.js written by David Elmer
*/

// get the table body for manipulation
let table_body = document.getElementById('table_body');

// create event listeners for each delete button
document.addEventListener('DOMContentLoaded', function(){
    // add event listener for the form submit button
    document.getElementById('jobs_insert').addEventListener('click', insertRequest);
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
    row.id = data.job_id;

    // job id
    let job_id = document.createElement('td');
    job_id.textContent = data.job_id;
    row.appendChild(job_id);

    // job name
    let name = document.createElement('td');
    name.textContent = data.name;
    row.appendChild(name);

    // shift start
    let shift_start = document.createElement('td');
    shift_start.textContent = data.shift_start;
    row.appendChild(shift_start);

    // shift end
    let shift_end = document.createElement('td');
    shift_end.textContent = data.shift_end;
    row.appendChild(shift_end);

    // hourly rate
    let hourly_rate = document.createElement('td');
    hourly_rate.textContent = data.hourly_rate;
    row.appendChild(hourly_rate);
    
    // delete button
    // create td and button
    let delete_col = document.createElement('td');
    let delete_button = document.createElement('input');
    delete_button.type = 'button';
    delete_button.name = data.job_id;
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
    document.getElementById('shift_start').value = '';
    document.getElementById('shift_end').value = '';
    document.getElementById('hourly_rate').value = '';
}

// ---------- INSERT REQUEST ----------
function insertRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    let data = {
        name        :   document.getElementById('name').value,
        shift_start :   document.getElementById('shift_start').value,
        shift_end   :   document.getElementById('shift_end').value,
        hourly_rate :   document.getElementById('hourly_rate').value
    }
        
    // set up AJAX request
    let req = new XMLHttpRequest;
    req.open('POST', '/jobs', true);
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
            console.log('There was an error inserting Job.');
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
    req.open('DELETE', '/jobs', true);
    req.setRequestHeader('Content-Type', 'application/json');
    
    // tell AJAX how to resolve
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let affected_rows = JSON.parse(req.responseText)
            if (affected_rows) {
                deleteRow(data.id);
            }
        } else if (req.readyState == 4 && req.status != 200) {
            console.log('There was an error deleting Job ' + data.id + '.');
        }
    }

    // send the request and wait for the response
    req.send(JSON.stringify(data));
}