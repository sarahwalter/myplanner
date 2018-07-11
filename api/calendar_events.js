const mysql = require('./dbcon.js');

/***************************************************
 * Name: createEvent
 * Input: Body with (minimum) `user_id`, `start_datetime`
 * and `title`.
 * Output: "201 Created" if successful
 **************************************************/
exports.createEvent = function(req, res){
    //Verify that the request body exists
    if (!req.body) { return parameterErr(res, "Missing body of request"); }

    //Set all calendar_event fields
    var user = (req.body[0].user_id) ? req.body[0].user_id : null;
    var start = (req.body[0].start_datetime) ? req.body[0].start_datetime : null;
    var end = (req.body[0].end_datetime) ? req.body[0].end_datetime : start;
    var title = (req.body[0].title) ? req.body[0].title : null;
    var notes = (req.body[0].notes) ? req.body[0].notes : null;
    var stop_date = (req.body[0].rep_stop_date) ? req.body[0].rep_stop_date : null;
    var day_month = (req.body[0].rep_day_month) ? req.body[0].rep_day_month : null;
    var day_week = (req.body[0].rep_day_week) ? req.body[0].rep_day_week : null;
    var event_type = (req.body[0].event_type) ? req.body[0].event_type : null;
    var amount = (req.body[0].amount) ? req.body[0].amount : null;
    var job_id = (req.body[0].job_id) ? req.body[0].job_id : null;

    //Verify the minimum requirements for inserting have been met
    if (!user || !start || !title) { return parameterErr(res, "Missing required fields"); }

    mysql.pool.query("INSERT INTO calendar_events (user_id, start_datetime, end_datetime, title, notes, rep_stop_date,"
    + " rep_day_month, rep_day_week, event_type, amount, job_id)"
    + " VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [user, start, end, title, notes, stop_date, day_month, day_week, event_type, amount, job_id], function(err){
        if (err) { return sqlErr(res, err); }
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

    if (!event_id) { return res.status(400).send("Missing event_id"); }

    mysql.pool.query("DELETE FROM calendar_events WHERE event_id=?", [event_id], function(err){
        if (err) { return sqlErr(res, err); }
        else { return res.status(204).send(); }
    });
};

/***************************************************
 * Name: eventInfo
 * Input: URL param `user_id`
 * Output: all fields associated with corresponding
 * rows in `calendar_events`
 **************************************************/
exports.eventInfo = function(req, res){
    var event = req.params.event_id;

    if (!event) { return res.status(400).send("Missing event_id parameter")}

    mysql.pool.query("SELECT start_datetime, end_datetime, title, notes, rep_stop_date, rep_day_month, rep_day_week,"
        + " active, event_type, amount, job_id"
        + " FROM calendar_events"
        + " WHERE user_id = ?", [event], function(err, results){
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
    if (!req.body) { return parameterErr(res, "Missing body of request"); }

    //Set all calendar_event fields
    var user = (req.body[0].user_id) ? req.body[0].user_id : null;
    var start = (req.body[0].start_datetime) ? req.body[0].start_datetime : null;
    var end = (req.body[0].end_datetime) ? req.body[0].end_datetime : start;
    var title = (req.body[0].title) ? req.body[0].title : null;
    var notes = (req.body[0].notes) ? req.body[0].notes : null;
    var stop_date = (req.body[0].rep_stop_date) ? req.body[0].rep_stop_date : null;
    var day_month = (req.body[0].rep_day_month) ? req.body[0].rep_day_month : null;
    var day_week = (req.body[0].rep_day_week) ? req.body[0].rep_day_week : null;
    var event_type = (req.body[0].event_type) ? req.body[0].event_type : null;
    var amount = (req.body[0].amount) ? req.body[0].amount : null;
    var job_id = (req.body[0].job_id) ? req.body[0].job_id : null;

    //Verify the minimum requirements for inserting have been met
    if (!user || !start || !title) { return parameterErr(res, "Missing required fields"); }

};

/************ HELPER FUNCTIONS BELOW ************/
/**************************************************
 * Name: eventInfoPrepper
 * Input: JSON object of calendar_event fields
 * Output: JSON object of formatted calendar_event
 * fields
 *************************************************/
function eventInfoPrepper(body){
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

/**************************************************
 * Name: parameterErr
 * Description: Returns 400-errors with a specified
 * error message.
 * Input: The `err` parameter (user provided string)
 * and the `res` parameter for the request.
 *************************************************/
function parameterErr(res, err){
    return res.status(400).send(err);
}

/**************************************************
 * Name: sqlErr
 * Description: Returns MySQL error to the client.
 * Input: The `err` parameter from a MySQL query and
 * the `res` parameter for the request.
 *************************************************/
function sqlErr(res, err){
    return res.status(500).send("MySQL error: " + err);
}

