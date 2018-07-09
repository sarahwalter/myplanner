//This code courtesy of: https://medium.com/@hellotunmbi/how-to-deploy-angular-application-to-heroku-1d56e09c5147
//Install express server
const express = require('express');
const mysql = require('./dbcon.js');
const path = require('path');
const app = express();
var appPort = (process.env.PORT || 8080);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/app'));

app.route('/').get(function(req,res) {
    res.sendFile(path.join(__dirname+'/app/index.html'));
});

app.route('/users').get(function(req, res){
    console.log("Made it into users");
    mysql.pool.query("SELECT * FROM users", function(err, results){
        res.send(results);
    });
});

// Start the app by listening on the default Heroku port
app.listen(appPort);
console.log("Listening on port " + appPort);