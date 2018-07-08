const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'heroku_17a4cf0a865e81c'
});

module.exports.pool = pool;