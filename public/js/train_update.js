/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

train_update.js written by Chenliang Wang
*/

let updateTrainForm = document.getElementById('train_update');
updateTrainForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    let trainValue = document.getElementById("train_id").value;
    let carNumValue = document.getElementById("train_car").value;
    let capacityValue = document.getElementById("capacity").value;
    let routeValue = document.getElementById("route_id").value;
    let yardValue = document.getElementById("yard_id").value;

    let data = {
        train_id: trainValue,
        car: carNumValue,
        car_capacity: capacityValue,
        route: routeValue,
        yard: yardValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_train/:id", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // pop alert and redirect to previous page
            alert("Update successful");
            window.location = ('/trains');
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})
