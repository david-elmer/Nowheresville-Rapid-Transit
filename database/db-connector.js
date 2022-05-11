var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    port            : '3306',
    user            : 'root',
    password        : '00000000',
    database        : 'nrt'
});

module.exports.pool = pool;