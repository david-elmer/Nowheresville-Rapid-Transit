/****************************************************************
-- Program: Nowheresville Rapid Transit Management
-- Author: David Elmer, Chenliang Wang
-- Date: 7/24/2021
-- Description: Data definition queries and sample data
****************************************************************/

-- Data Definition Queries

DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS yards;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS routes;

CREATE TABLE routes(
    route_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL UNIQUE,
    start_time time NOT NULL,
    end_time time NOT NULL,
    frequency int NOT NULL
);

CREATE TABLE stations(
    station_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL UNIQUE,
    street_1 varchar(255) NOT NULL,
    street_2 varchar(255),
    city varchar(255),
    state varchar(255),
    zip int
);

CREATE TABLE yards(
    yard_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL UNIQUE,
    street varchar(255) NOT NULL,
    total_employee int NOT NULL,
    curr_occupancy int NOT NULL,
    max_occupancy int NOT NULL,
    city varchar(255),
    state varchar(255),
    zip int
);

CREATE TABLE trains(
    train_id int PRIMARY KEY AUTO_INCREMENT,
    car int NOT NULL,
    car_capacity int NOT NULL,
    route int,
    yard int,
    FOREIGN KEY (route) REFERENCES routes (route_id) ON DELETE SET NULL,
    FOREIGN KEY (yard) REFERENCES yards (yard_id) ON DELETE SET NULL
);

CREATE TABLE employees(
    employee_id int PRIMARY KEY AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    street varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    zip int NOT NULL,
    dob date NOT NULL,
    train int,
    yard int,
    station int,
    FOREIGN KEY (train) REFERENCES trains (train_id) ON DELETE SET NULL,
    FOREIGN KEY (yard) REFERENCES yards (yard_id) ON DELETE SET NULL,
    FOREIGN KEY (station) REFERENCES stations (station_id) ON DELETE SET NULL
);

CREATE TABLE jobs(
    job_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    shift_start time NOT NULL,
    shift_end time NOT NULL,
    hourly_rate int NOT NULL
);

CREATE TABLE transfers(
    route int,
    station int,
    PRIMARY KEY (route, station),
    FOREIGN KEY (route) REFERENCES routes (route_id) ON DELETE CASCADE,
    FOREIGN KEY (station) REFERENCES stations (station_id) ON DELETE CASCADE
);

CREATE TABLE assignments(
    assignment_id int PRIMARY KEY AUTO_INCREMENT,
    employee_id int,
    job_id int,
    start_date date NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs (job_id) ON DELETE CASCADE
);

-- Insert sample data

INSERT INTO routes (name, start_time, end_time, frequency)
VALUES
('Blue', '06:00', '22:00', 15),
('Red', '06:00', '22:00', 10),
('Green', '06:00', '22:00', 18);

INSERT INTO stations (name, street_1, street_2, city, state, zip)
VALUES
('Milltown', 'Main', 'Oak', 'Nowheresville', 'NO', 12345),
('Uptown', 'Cherry', 'Washington', 'Nowheresville', 'NO', 12305),
('Downtown', '10 St', '6 Ave', 'Nowheresville', 'NO', 12315);

INSERT INTO yards
(name, street, total_employee, curr_occupancy, max_occupancy, city, state, zip)
VALUES
('Milltown Yard', '123 Main St', 15, 5, 10, 'Nowheresville', 'NO', 12345),
('Briars Creek Yard', '52 Washington St', 20, 7, 12, 'Nowheresville', 'NO', 12371),
('Uptown Yard', '255 Cherry St', 13, 3, 8, 'Nowheresville', 'NO', 12333);

INSERT INTO trains (car, car_capacity, route, yard)
VALUES
(5, 75, 1, NULL),
(8, 50, NULL, 1),
(5, 75, 2, NULL);

INSERT INTO employees (first_name, last_name, street, city, state, zip, dob, train, yard, station)
VALUES
('John', 'Smith', '58 Webster St', 'Nowheresville', 'NO', 12305, '1970-07-28', 1, NULL, NULL),
('Kerry', 'Gladwell', '185 Oakridge Ln', 'Nowheresville', 'NO', 12333, '1983-10-12', NULL, 2, NULL),
('Bob', 'Hardy', '255 Edgewood Ave', 'Nowhereseville', 'NO', 12357, '1977-03-29', NULL, NULL, 1);

INSERT INTO jobs (name, shift_start, shift_end, hourly_rate)
VALUES
('Station Attendant', '09:00', '17:00', 27),
('Conductor', '05:30', '13:30', 35),
('Heavy Mechanic', '07:30', '15:30', 43);

INSERT INTO transfers (route, station) VALUES (1, 3), (2, 2), (2, 1);

INSERT INTO assignments (employee_id, job_id, start_date)
VALUES (1, 3, '2017-03-01'), (2, 2, '2015-07-15'), (3, 1, '2010-12-10');
