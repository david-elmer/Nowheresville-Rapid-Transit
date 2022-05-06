/****************************************************************
-- Program: Nowheresville Rapid Transit Management
-- Author: David Elmer, Chenliang Wang
-- Date: 7/24/2021
-- Description: Data manipulation queries
-- ':' character used throughout to denote variables
****************************************************************/

-- Routes
-- display all routes
SELECT route_id, name, start_time, end_time, frequency FROM routes;
-- add a new route
INSERT INTO routes (name, start_time, end_time, frequency) 
VALUES (:name_input, :start_time_input, :end_time_input, :frequency_input);


-- Stations
-- display all stations
SELECT station_id, name, street_1, street_2, city, state, zip FROM stations;
-- add a new station
INSERT INTO stations (name, street_1, street_2, city, state, zip)
VALUES (:name_input, :street_1_input, :street_2_input, :city_input, :state_input, :zip_input);
-- search for a station by name
SELECT station_id, name, street_1, street_2, city, state, zip FROM stations WHERE name LIKE "%:name_input%";


-- Trains
-- display all trains
SELECT train_id, car, car_capacity, route, yard FROM trains;
-- add a new train
INSERT INTO trains (car, car_capacity, route, yard)
VALUES (:car_input, :car_capacity_input, :route_name_input, :yard_name_input);
-- populate dropdown for insert form
SELECT route_id, name FROM routes;
SELECT yard_id, name FROM yards;
-- update a train's info
UPDATE trains SET car = :car_input, car_capacity = :car_capacity_input, 
(SELECT route_id FROM routes WHERE name = :route_name_input), 
(SELECT yard_id FROM yards WHERE name = :yard_name_input)
WHERE train_id = :train_id_from_update_form;


-- Transfers
-- display all transfers
SELECT route, station FROM transfers;
-- populate dropdown for insert form
SELECT station_id, name FROM stations;
SELECT route_id, name FROM routes;
-- add a new stop by station and route name
INSERT INTO transfers (station_id, route_id) 
VALUES ((SELECT station_id FROM stations WHERE name = :name_input),
(SELECT route_id FROM routes WHERE name = :name_input));


-- Yards
-- Display all yards
SELECT yard_id, name, street, total_employee, curr_occupancy, max_occupancy, city, state, zip FROM yards ORDER BY yard_id;
-- Add a new yard
INSERT INTO yards
(name, street, total_employee, curr_occupancy, max_occupancy, city, state, zip)
VALUES
(:name_input, :street_input, :total_employee_input, :curr_occupancy_input,
:max_occupancy_input, :city_input, :state_input, :zip_input);
-- Delete a yard
DELETE FROM yards WHERE yard_id = :yard_id_input;


-- Jobs
-- Display all jobs
SELECT job_id, name, shift_start, shift_end, hourly_rate FROM jobs ORDER BY job_id;
-- Add a new job
INSERT INTO jobs (name, shift_start, shift_end, hourly_rate)
VALUES (:name_input, :shift_start_input, :shift_end_input, :hourly_rate_input);
-- Delete a job
DELETE FROM jobs WHERE job_id = :job_id_input;


-- Employees
-- Display all employees
SELECT employee_id, first_name, last_name, street, city, state, zip, dob, train, yard, station FROM employees ORDER BY employee_id;
-- Add a new employee
INSERT INTO employees (first_name, last_name, street, city, state, zip, dob, train, yard, station)
VALUES
(:first_name_input, :last_name_input, :street_input, :state_input, :zip_input,
:dob_input, :train_input, :yard_input, :station_input);
-- Populate dropdowns for insert form
SELECT train_id FROM trains ORDER BY train_id;
SELECT yard_id, name FROM yards ORDER BY name;
SELECT station_id, name FROM stations ORDER BY name;
-- Delete an employee
DELETE FROM employees WHERE employee_id = :employee_id_input;


-- Assignments
-- Display all assignments
SELECT a.assignment_id, a.employee_id, e.first_name, e.last_name, a.job_id, j.name, a.start_date FROM assignments a
INNER JOIN employees e ON a.employee_id = e.employee_id
INNER JOIN jobs j ON j.job_id = a.job_id;
-- Display all employees and populate dropdown
SELECT employee_id, first_name, last_name, dob FROM employees ORDER BY last_name;
-- Display all jobs and populate dropdown
SELECT job_id, name, shift_start, shift_end FROM jobs ORDER BY name;
-- Add a new assignment
INSERT INTO assignments (employee_id, job_id, start_date)
VALUES (:employee_id_input, :job_id_input, :start_date_input);
-- Delete an assignment
DELETE FROM assignments WHERE assignment_id = :assignment_id_input;
