# Nowheresville Rapid Transit Management
Database driven web app using html/css/javascript and node.js/express/handlebars with a mySQL database

#

This project was co-written by David Elmer (david.elmer@gmail.com) and Chenliang Wang (wangch9@oregonstate.edu).

Implementation of Yards, Employees, Jobs, and Assignments by David Elmer

Implementation of Routes, Trains, Stations, and Transfers by Chenliang Wang

## Overview

Nowheresville Rapid Transit Management is a database driven web app for tracking the personnel and assets of the public transit system for the fictitious city Nowheresville.

Nowheresville is a city with a population of 500,000 people. Nowheresville Rapid Transit (NRT) operates 5 routes and 50 stations over 100 miles of track with a fleet of 50 trains. There are 5 yards which are each home to a maintenance shop and storage for off-route trains. Daily ridership on NRT averages 250,000 trips. NRT employs 750 people. The database will contain six entities: Routes, Stations, Trains, Yards, Employees, and Jobs. Two intersection tables--Assignments and Transfers--will represent the many-to-many relationships between Employees/Jobs, and Routes/Stations. The database will record on which of the five Routes or in which of the five Yards a train is located. The database will also record Employees’ details including which Jobs they are currently assigned. The database will be accessed daily by managers from each department--at least one user in asset management and one user in personnel management.