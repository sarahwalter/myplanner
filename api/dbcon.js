const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'heroku_17a4cf0a865e81c'
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'myplanner-test'
});

module.exports.pool = pool;