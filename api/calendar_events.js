const mysql = require('./dbcon.js');

exports.rules = function(req, res){
    var user = req.query.user_id;
    mysql.pool.query("SELECT * FROM calendar_events WHERE user_id = ?", [user], function(err, results){
        res.send(results);
    });
};