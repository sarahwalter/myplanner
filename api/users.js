const mysql = require('./dbcon.js');

exports.userInfo = function(req, res){
    var user = req.params.user_id;
    mysql.pool.query("SELECT first_name, last_name, email_address"
    + " FROM users"
    + " WHERE user_id=?", [user], function(err, results){
        if(err) { res.status(500).send('MySQL Error:' + err); }
        else { res.send(results); }
    });
};