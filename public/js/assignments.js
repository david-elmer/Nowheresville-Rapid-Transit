/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

assignments.js written by David Elmer
*/

// get the table body for manipulation
let table_body = document.getElementById('table_body');

// create event listeners for each delete button
document.addEventListener('DOMContentLoaded', function(){
    // add event listener for form submit button
    document.getElementById('assignments_insert').addEventListener('click', insertRequest);
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

// ---------- INSERT ROW ----------
// function inserts row with data passed from the AJAX request
function insertRow(data) {
    // create a new table row and populate it with the data received back from the insert request
    // create row
    let row = document.createElement('tr');
    row.id = data.assignment_id;

    // employee_id
    let employee_id = document.createElement('td');
    employee_id.textContent = data.employee_id;
    row.appendChild(employee_id);

    // first_name
    let first_name = document.createElement('td');
    first_name.textContent = data.first_name
    row.appendChild(first_name);

    // last_name
    let last_name = document.createElement('td');
    last_name.textContent = data.last_name
    row.appendChild(last_name);

    // job_id
    let job_id = document.createElement('td');
    job_id.textContent = data.job_id
    row.appendChild(job_id);

    // name
    let name = document.createElement('td');
    name.textContent = data.name
    row.appendChild(name);

    // start_date
    let start_date = document.createElement('td');
    start_date.textContent = data.start_date;
    row.appendChild(start_date);
    
    // delete button
    // create td and button
    let delete_col = document.createElement('td');
    let delete_button = document.createElement('input');
    delete_button.type = 'button';
    delete_button.name = data.assignment_id;
    delete_button.value = 'Delete';
    // add event listener to button
    delete_button.addEventListener('click', deleteRequest);
    // add td and button to row
    delete_col.appendChild(delete_button);
    row.appendChild(delete_col);

    // add row to table
    table_body.appendChild(row);
}

// ---------- DELETE ROW ----------
// function removes the row with the id passed to it from the table body
function deleteRow(id) {
    let row = document.getElementById(id);
    table_body.removeChild(row);
}

// ---------- CLEAR INPUT FORM --------
function clearForm() {
    let emp_select = document.getElementById('employee_id_select').firstElementChild;
    emp_select.selected = true;
    let job_select = document.getElementById('job_id_select').firstElementChild;
    job_select.selected = true;
    document.getElementById('start_date').value = '';
}

// ---------- INSERT REQUEST ----------
function insertRequest() {
    // Citation for function
    // Date: 08/02/2021
    // AJAX request modified from nodejs starter app:
    // Author: George Kochera
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    
    // if user does not enter a date, alert that it is a required field,
    // otherwise, make the request
    if (document.getElementById('start_date').value == '') {
        alert('Please specify a date');
    } else {
        let data = {
            employee_id :   document.getElementById('employee_id_select').value,
            job_id      :   document.getElementById('job_id_select').value,
            start_date  :   document.getElementById('start_date').value
        }
        
        // set up AJAX request
        let req = new XMLHttpRequest;
        req.open('POST', '/assignments', true);
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
                console.log('There was an error inserting Assignment.');
            }
        }

        // send the request and wait for the response
        req.send(JSON.stringify(data));
    }
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
    req.open('DELETE', '/assignments', true);
    req.setRequestHeader('Content-Type', 'application/json');
    
    // tell AJAX how to resolve
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let affected_rows = JSON.parse(req.responseText)
            if (affected_rows) {
                deleteRow(data.id);
            }
        } else if (req.readyState == 4 && req.status != 200) {
            console.log('There was an error deleting Assignment ' + data.id + '.');
        }
    }

    // send the request and wait for the response
    req.send(JSON.stringify(data));
}