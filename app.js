/*
Nowheresville Rapid Transit Management
David Elmer and Chenliang Wang

app.js is the node.js backend for the app.

Routes for Yards, Employees, Jobs, and Assignments written by David Elmer
Routes for Routes, Trains, Stations, and Transfers written by Chenliang Wang
*/

// Citation for app.js
// Date: 08/02/2021
// Modified from nodejs starter app:
// Author: George Kochera
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

// Express
let express = require('express');
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

PORT = 54314;

// Database
let db = require('./database/db-connector');

// Handlebars
let exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));


/*
    ROUTES
*/

// ---------- HOME PAGE ----------
app.get('/', function(req, res){
    res.render('index');
});


// ---------- EMPLOYEES ----------
// display all employees and new employee input form
app.get('/employees', function(req, res){
    let context = {};
    let query_employees = 'SELECT employee_id, first_name, last_name, street, city, state, zip, dob, train, yard, station FROM employees ORDER BY employee_id;';
    let query_trains = 'SELECT train_id FROM trains ORDER BY train_id;';
    let query_yards = 'SELECT yard_id, name FROM yards ORDER BY name;';
    let query_stations = 'SELECT station_id, name FROM stations ORDER BY name;';

    // get list of employees to populate table
    db.pool.query(query_employees, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // reformat date into a more friendly format
            for (let row of rows) {
                let options = {day: '2-digit', month: '2-digit', year: 'numeric'};
                let formatted_date = row.dob.toLocaleString('en-US', options);
                row.dob = formatted_date;
            }
            context.employees = rows;
            // get list of trains to populate dropdown
            db.pool.query(query_trains, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    context.trains = rows;
                    // get list of yards to populate dropdown
                    db.pool.query(query_yards, function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            context.yards = rows;
                            // get list of stations to populate dropdown
                            db.pool.query(query_stations, function(error, rows, fields){
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    context.stations = rows;
                                    // render the page
                                    res.render('employees', context);
                                }
                            });
                        }
                    });
                }
            });            
        }
    });
});

// add employees
app.post('/employees', function(req, res){
    let body = req.body;
    // parse body to convert train, yard, and station to ints
    let train = parseInt(body.train);
    if (isNaN(train)) {
        train = null;
    }
    let yard = parseInt(body.yard);
    if (isNaN(yard)) {
        yard = null;
    }
    let station = parseInt(body.station);
    if (isNaN(station)) {
        station = null;
    }

    // define query and input parameters
    let query = 'INSERT INTO employees (first_name, last_name, street, city, state, zip, dob, train, yard, station) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    let values = [body.first_name, body.last_name, body.street, body.city, body.state, body.zip, body.dob, train, yard, station];
    
    // query the database
    db.pool.query(query, values, function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // query for the inserted row to pass back in the response
            let query_select = 'SELECT employee_id, first_name, last_name, street, city, state, zip, dob, train, yard, station FROM employees WHERE employee_id = ?;';
            db.pool.query(query_select, [result.insertId], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // reformat date into a more friendly format
                    for (let row of rows) {
                        let options = {day: '2-digit', month: '2-digit', year: 'numeric'};
                        let formatted_date = row.dob.toLocaleString('en-US', options);
                        row.dob = formatted_date;
                    }
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
});

// delete employees
app.delete('/employees', function(req, res){
    // define request parameters
    let id = req.body.id;
    let query = 'DELETE FROM employees WHERE employee_id = ?;';

    // query the database
    db.pool.query(query, [id], function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(JSON.stringify(result.affectedRows));
        }
    });
});


// ---------- YARDS ----------
// display all yards and new yard input form
app.get('/yards', function(req, res){
    let query = "SELECT yard_id, name, street, total_employee, curr_occupancy, max_occupancy, city, state, zip FROM yards ORDER BY yard_id;";

    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('yards', {yards: rows});
        }
    });
});

// add yards
app.post('/yards', function(req, res){
    let body = req.body;

    // define query and input parameters
    let query = 'INSERT INTO yards (name, street, total_employee, curr_occupancy, max_occupancy, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
    let values = [body.name, body.street, body.total_employee, body.curr_occupancy, body.max_occupancy, body.city, body.state, body.zip];

    // query the database
    db.pool.query(query, values, function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // query for the inserted row to pass back in the response
            let query_select = 'SELECT * FROM yards WHERE yard_id = ?;';
            db.pool.query(query_select, [result.insertId], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
});

// delete yards
app.delete('/yards', function(req, res){
    // define request parameters
    let id = req.body.id;
    let query = 'DELETE FROM yards WHERE yard_id = ?;';

    // query the database
    db.pool.query(query, [id], function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(JSON.stringify(result.affectedRows));
        }
    });
});


// ---------- JOBS ----------
// display all jobs and new job input form
app.get('/jobs', function(req, res){
    let query = "SELECT job_id, name, shift_start, shift_end, hourly_rate FROM jobs ORDER BY job_id;";

    // query the database and render the page
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('jobs', {jobs: rows});
        }
    });
});

// add jobs
app.post('/jobs', function(req, res){
    let body = req.body;

    // define query and input parameters
    let query = 'INSERT INTO jobs (name, shift_start, shift_end, hourly_rate) VALUES (?, ?, ?, ?);'
    let values = [body.name, body.shift_start, body.shift_end, body.hourly_rate];
        
    // query the database
    db.pool.query(query, values, function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // query for the inserted row to pass back in the response
            let query_select = 'SELECT * FROM jobs WHERE job_id = ?;';
            db.pool.query(query_select, [result.insertId], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
});

// delete jobs
app.delete('/jobs', function(req, res){
    // define request parameters
    let id = req.body.id;
    let query = 'DELETE FROM jobs WHERE job_id = ?;';

    // query the database
    db.pool.query(query, [id], function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(JSON.stringify(result.affectedRows));
        }
    });
});


// ---------- ASSIGNMENTS ----------
// display all assignments and new assignment input form
app.get('/assignments', function(req, res){
    let context = {};
    let query_assignments = 'SELECT a.assignment_id, a.employee_id, e.first_name, e.last_name, a.job_id, j.name, a.start_date FROM assignments a INNER JOIN employees e ON a.employee_id = e.employee_id INNER JOIN jobs j ON j.job_id = a.job_id;';
    let query_employees = 'SELECT employee_id, first_name, last_name, dob FROM employees ORDER BY last_name;';
    let query_jobs = 'SELECT job_id, name, shift_start, shift_end FROM jobs ORDER BY name;';

    // get list of employees to populate table
    db.pool.query(query_assignments, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // reformat date into a more friendly format
            for (let row of rows) {
                let options = {day: '2-digit', month: '2-digit', year: 'numeric'};
                let formatted_date = row.start_date.toLocaleString('en-US', options);
                row.start_date = formatted_date;
            }
            // store rows to pass to render
            context.assignments = rows;

            // get list of employees to populate table and dropdown
            db.pool.query(query_employees, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // reformat date into a more friendly format
                    for (let row of rows) {
                        let options = {day: '2-digit', month: '2-digit', year: 'numeric'};
                        let formatted_date = row.dob.toLocaleString('en-US', options);
                        row.dob = formatted_date;
                    }
                    // store rows to pass to render
                    context.employees = rows;

                    // get list of jobs to populate table and dropdown
                    db.pool.query(query_jobs, function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // store rows to pass to render
                            context.jobs = rows;
                            
                            // render the page
                            res.render('assignments', context);
                        }
                    });
                }
            });            
        }
    });
});

// add assignments
app.post('/assignments', function(req, res){
    let body = req.body;

    // define query and input parameters
    let query_insert = 'INSERT INTO assignments (employee_id, job_id, start_date) VALUES (?, ?, ?);'
    let values = [body.employee_id, body.job_id, body.start_date];
    
    // query the database
    db.pool.query(query_insert, values, function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // query for the inserted row to pass back in the response
            let query_select = 'SELECT a.assignment_id, a.employee_id, e.first_name, e.last_name, a.job_id, j.name, a.start_date FROM assignments a INNER JOIN employees e ON a.employee_id = e.employee_id INNER JOIN jobs j ON j.job_id = a.job_id WHERE a.assignment_id = ?;';
            let assignment_id = result.insertId;
            db.pool.query(query_select, [assignment_id], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // reformat date into a more friendly format
                    for (let row of rows) {
                        let options = {day: '2-digit', month: '2-digit', year: 'numeric'};
                        let formatted_date = row.start_date.toLocaleString('en-US', options);
                        row.start_date = formatted_date;
                    }
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
});

// delete assignments
app.delete('/assignments', function(req, res){
    // define request parameters
    let id = req.body.id;
    let query = 'DELETE FROM assignments WHERE assignment_id = ?;';

    // query the database
    db.pool.query(query, [id], function(error, result){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(JSON.stringify(result.affectedRows));
        }
    });
});


// ---------- ROUTES ----------

// display all routes
app.get('/routes', function(req, res)
    {  
        let query1 = "SELECT route_id, name, start_time, end_time, frequency FROM routes;";
        db.pool.query(query1, function(error, rows, fields){ 
            res.render('routes', {data: rows});                  
        })                                                      
    });

// add a new route
app.post('/add_route', function(req, res)
    {
        let data = req.body;

        query1 = `INSERT INTO routes (name, start_time, end_time, frequency) 
        VALUES ('${data['name']}', '${data['start_time']}', '${data['end_time']}', '${data['frequency']}')`;
        
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT route_id, name, start_time, end_time, frequency FROM routes;`;
                db.pool.query(query2, function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }        
        })
    });


// ---------- STATIONS ----------

// display all stations and search stations by name
app.get('/stations', function(req, res)
    {  
        let query1;

        // search stations by name
        if (req.query.street_name === undefined){
            query1 = "SELECT station_id, name, street_1, street_2, city, state, zip FROM stations;";
        } 
        else {
            query1 = `SELECT station_id, name, street_1, street_2, city, state, zip FROM stations WHERE name LIKE "%${req.query.street_name}%";`
        }
        db.pool.query(query1, function(error, rows, fields){ 
            return res.render('stations', {data: rows});                  
        })                                                      
    });

// add a station
app.post('/add_station', function(req, res)
    {
        let data = req.body;
        query1 = `INSERT INTO stations (name, street_1, street_2, city, state, zip) 
        VALUES ('${data['name']}', '${data['street_1']}', '${data['street_2']}', '${data['city']}', '${data['state']}', '${data['zip']}')`;
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT station_id, name, street_1, street_2, city, state, zip FROM stations;`;
                db.pool.query(query2, function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }        
        })
    });


// ---------- TRAINS ----------

// display all trains
app.get('/trains', function(req, res)
    {  
        let query1 = "SELECT train_id, car, car_capacity, route, yard FROM trains;";
        let query2 = "SELECT route_id, name FROM routes;";
        let query3 = "SELECT yard_id, name FROM yards;";

        db.pool.query(query1, function(error, rows, fields){ 
            let trains = rows;

            db.pool.query(query2, (error, rows, fields) => {
                let routes = rows;

                // display route_id as route name in dropdown menu
                let routemap = {}
                routes.map(route => {
                    let id = parseInt(route.route_id, 10);
                    routemap[id] = route['name']
                })

                trains = trains.map(train => {
                    return Object.assign(train, {route: routemap[train.route]})
                })

                db.pool.query(query3, (error, rows, fields) => {
                    let yards = rows;

                    // display yard_id as yard name in dropdown menu
                    let yardmap = {}
                    yards.map(yard => {
                        let yardID = parseInt(yard.yard_id, 10);
                        yardmap[yardID] = yard['name']
                    })

                    trains = trains.map(train => {
                        return Object.assign(train, {yard: yardmap[train.yard]})
                    })

                    return res.render('trains', {data: trains, routes: routes, yards: yards});
                })   
            })            
        })                                                      
    });

// add a train
app.post('/add_train', function(req, res)
    {
        let data = req.body;

        // if no route or yard selected, use NULL
        let route = parseInt(data.route);
        if (isNaN(route)){
            route = 'NULL'
        }
        let yard = parseInt(data.yard);
        if (isNaN(yard)){
            yard = 'NULL'
        }

        query1 = `INSERT INTO trains (car, car_capacity, route, yard) VALUES 
        ('${data['car']}', '${data['car_capacity']}', ${route}, ${yard})`;

        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT train_id, car, car_capacity, route, yard FROM trains;`;
                db.pool.query(query2, function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// display update train page
app.get('/update_train/:id', function(req, res)
    {  
        let id = req.params.id;
        let query1 = "SELECT train_id, car, car_capacity, route, yard FROM trains WHERE train_id="+id+";";
        let query2 = "SELECT route_id, name FROM routes;";
        let query3 = "SELECT yard_id, name FROM yards;";

        db.pool.query(query1, function(error, rows, fields){
            let trains = rows;

            // populate drop down menu for route and yard
            db.pool.query(query2, function(error, rows, fields){
                let routes = rows;

                db.pool.query(query3, function(error, rows, fields){
                    let yards = rows;
                    res.render('train_update', {data: trains, routes: routes, yards: yards});  
                })
            })                
        })                                                      
    });

// update train info
app.post('/update_train/:id', function(req, res)
    {
        let data = req.body;

        // if route and/or yard selected as None, use NULL
        let route = parseInt(data.route);
        if (isNaN(route)){
            route = 'NULL'
        }
        let yard = parseInt(data.yard);
        if (isNaN(yard)){
            yard = 'NULL'
        }

        let query1 = `UPDATE trains SET 
        car = '${data['car']}', car_capacity = '${data['car_capacity']}', 
        route = ${route}, yard = ${yard} WHERE train_id = '${data['train_id']}';`;

        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }
        })
    });


// ---------- TRANSFERS ----------

// display all stops
app.get('/transfers', function(req, res)
    {  
        let query1 = "SELECT route, station FROM transfers;";
        let query2 = "SELECT route_id, name FROM routes;";
        let query3 = "SELECT station_id, name FROM stations;";

        db.pool.query(query1, function(error, rows, fields){
            let transfers = rows;

            db.pool.query(query2, function(error, rows, fields){
                let routes = rows;

                // display route_id as route name
                let routemap = {}
                routes.map(route => {
                    let id = parseInt(route.route_id, 10);
                    routemap[id] = route['name']
                })

                transfers = transfers.map(stop => {
                    return Object.assign(stop, {route: routemap[stop.route]})
                })

                db.pool.query(query3, function(error, rows, fields){
                    let stations = rows;

                    // display station_id as station name
                    let stationmap = {}
                    stations.map(station => {
                        let statID = parseInt(station.station_id, 10);
                        stationmap[statID] = station['name']
                    })

                    transfers = transfers.map(stop => {
                        return Object.assign(stop, {station: stationmap[stop.station]})
                    })
                    res.render('transfers', {data: transfers, routes: routes, stations: stations});  
                })
            })                     
        })                                                      
    });

// add a stop
app.post('/add_transfer', function(req, res)
    {
        let data = req.body;

        // if no station or yard selected, use NULL
        let station = parseInt(data.station);
        if (isNaN(station)){
            station = 'NULL'
        }
        let route = parseInt(data.route);
        if (isNaN(route)){
            route = 'NULL'
        }

        // create insert query
        query1 = `INSERT INTO transfers (station, route) VALUES (${station}, ${route})`;

        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT route, station FROM transfers;`;
                db.pool.query(query2, function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// ---------- 404 NOT FOUND ----------

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

/*
    LISTENER
*/

app.listen(PORT, function(){
    console.log(`Express started on http://${process.env.HOSTNAME}:${PORT}; press Ctrl-C to terminate.`)
});
