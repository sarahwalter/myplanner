const mysql = require('./dbcon.js');

exports.userInfo = function(req, res){
    var user = req.query.user_id;
    mysql.pool.query("SELECT * FROM users WHERE user_id = ?", [user], function(err, results){
        res.send(results);
    });
};