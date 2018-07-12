const mysql = require('./dbcon.js');
const error = require('./errors.js');

/***************************************************
 * Name: createEvent
 * Input: Body with (minimum) `user_id`, `start_datetime`
 * and `title`.
 * Output: "201 Created" if successful
 **************************************************/
exports.createEvent = function(req, res){
    //Verify that the request body exists
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    var e = eventInfoPrepper(req.body[0]);

    //Verify the minimum requirements for inserting have been met
    if (!e.user || !e.start || !e.title) { return error.parameterErr(res, "Missing required fields"); }

    mysql.pool.query("INSERT INTO calendar_events (user_id, start_datetime, end_datetime, title, notes, rep_stop_date,"
    + " rep_day_month, rep_day_week, event_type, amount, job_id)"
    + " VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [e.user, e.start, e.end, e.title, e.notes, e.stop_date, e.day_month, e.day_week, e.event_type, e.amount, e.job_id], function(err){
        if (err) { return error.sqlErr(res, err); }
        else { return res.status(201).send("Event Created"); }
    });
};

/***************************************************
 * Name: deleteEvent
 * Input: URL param `event_id`
 * Output: "204 No Content" if successful
 **************************************************/
exports.deleteEvent = function(req, res){
    var event_id = (req.body[0].event_id) ? req.body[0].event_id : null;

    if (!event_id) { return error.parameterErr(res, "Missing event_id parameter"); }

    mysql.pool.query("DELETE FROM calendar_events WHERE event_id=?", [event_id], function(err){
        if (err) { return error.sqlErr(res, err); }
        else { return res.status(204).send(); }
    });
};

/***************************************************
 * Name: eventInfoPerEvent
 * Input: URL param `event_id`
 * Output: all fields associated with corresponding
 * rows in `calendar_events`
 **************************************************/
exports.eventInfoPerEvent = function(req, res){
    var event = req.params.event_id;

    if (!event) { return error.parameterErr(res, "Missing event_id parameter"); }

    mysql.pool.query("SELECT start_datetime, end_datetime, title, notes, rep_stop_date, rep_day_month, rep_day_week,"
        + " active, event_type, amount, job_id"
        + " FROM calendar_events"
        + " WHERE event_id = ?", [event], function(err, results){
        if (err) { return sqlErr(res, err); }
        else { return res.send(results); }
    });
};

/***************************************************
 * Name: eventInfoPerUser
 * Input: URL param `user_id`
 * Output: all fields associated with corresponding
 * rows in `calendar_events`
 **************************************************/
exports.eventInfoPerUser = function(req, res){
    var user = req.params.user_id;

    if (!user) { return error.parameterErr(res, "Missing user_id parameter"); }

    mysql.pool.query("SELECT start_datetime, end_datetime, title, notes, rep_stop_date, rep_day_month, rep_day_week,"
        + " active, event_type, amount, job_id"
        + " FROM calendar_events"
        + " WHERE user_id = ?", [user], function(err, results){
        if (err) { return sqlErr(res, err); }
        else { return res.send(results); }
    });
};

/***************************************************
 * Name: updateEvent
 * Input: Body with (minimum) `user_id`, `start_datetime`
 * and `title` and `ewent_id`.
 * Output: "204 No Content" if successful
 **************************************************/
exports.updateEvent = function(req, res){
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    var e = eventInfoPrepper(req.body[0]);

    //Verify the minimum requirements for inserting have been met
    if (!e.user || !e.start || !e.title) { return error.parameterErr(res, "Missing required fields"); }

    mysql.pool.query("UPDATE calendar_events"
    + " SET start_datetime=?, end_datetime=?, title=?, notes=?, rep_stop_date=?, rep_day_month=?, rep_day_week=?,"
    + " event_type=?, amount=?, job_id=?",
    [e.start, e.end, e.title, e.notes, e.stop_date, e.day_month, e.day_week, e.event_type, e.amount, e.job_id], function(err){
       if (err) { return error.sqlErr(res, err); }
       else { return res.status(204).send(); }
    });
};

/************ HELPER FUNCTIONS BELOW ************/
/**************************************************
 * Name: eventInfoPrepper
 * Input: JSON object of calendar_event fields
 * Output: JSON object of formatted calendar_event
 * fields
 *************************************************/
function eventInfoPrepper(body){
    var event_id = (body.event_id) ? body.event_id : null;
    var user = (body.user_id) ? body.user_id : null;
    var start = (body.start_datetime) ? body.start_datetime : null;
    var end = (body.end_datetime) ? body.end_datetime : start;
    var title = (body.title) ? body.title : null;
    var notes = (body.notes) ? body.notes : null;
    var stop_date = (body.rep_stop_date) ? body.rep_stop_date : null;
    var day_month = (body.rep_day_month) ? body.rep_day_month : null;
    var day_week = (body.rep_day_week) ? body.rep_day_week : null;
    var event_type = (body.event_type) ? body.event_type : null;
    var amount = (body.amount) ? body.amount : null;
    var job_id = (body.job_id) ? body.job_id : null;

    return {
        event_id : event_id,
        user : user,
        start : start,
        end : end,
        title : title,
        notes : notes,
        stop_date : stop_date,
        day_month : day_month,
        day_week : day_week,
        event_type : event_type,
        amount : amount,
        job_id : job_id
    };
}

