const mysql = require('./dbcon.js');
const error = require('./errors.js');

/***************************************************
 * Name: eventInfoPerUser
 * Input: URL param `user_id`
 * Output: all fields associated with corresponding
 * rows in `calendar_events`
 **************************************************/
exports.eventInfoPerUser = function(req, res){
    var user = req.params.user_id;

    if (!user) { return error.parameterErr(res, "Missing user_id parameter"); }

    mysql.pool.query("SELECT event_id, title, notes, start_datetime, end_datetime, isFullDay"
        + " FROM calendar_events"
        + " WHERE user_id = ?", [user], function(err, results){
        if (err) { return error.sqlErr(res, err); }
        else { return res.send(results); }
    });
};
