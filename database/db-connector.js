var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : '[host]',
    user            : '[user_name]',
    password        : '[password]',
    database        : '[database]'
});

module.exports.pool = pool;