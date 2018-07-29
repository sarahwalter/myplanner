const mysql = require('./dbcon.js');
const error = require('./errors.js');

/***************************************************
 * Name: createJob
 * Input: Body with all fields of jobs (except id)
 * Output: "201 Created" if successful
 **************************************************/
exports.createJob = function(req, res){
    //Verify that the request body exists
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    let j = jobInfoPrepper(req.body);

    //Verify the minimum requirements for inserting have been met
    console.log(j);
    for (let field in j) {
        if (field !== "job" && j[field] === null) { return error.parameterErr(res, "Missing required field: " + field); }
    }

    mysql.pool.query("INSERT INTO jobs (user_id, title, wage, frequency, filing_status, allowances,"
        + " retirement_percent, pretax_static, posttax_static, fed_tax_rate, loc_tax_rate)"
        + " VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [j.user, j.title, j.wage, j.frequency, j.filing, j.allowances, j.retirement, j.pretax, j.posttax, j.fed_tax_rate, j.loc_tax_rate],
        function(err){
            if (err) { return error.sqlErr(res, err); }
            else { return res.status(201).send("Job Created"); }
        });
};

/***************************************************
 * Name: deleteEvent
 * Input: URL param `job_id`
 * Output: "204 No Content" if successful
 **************************************************/
exports.deleteJob = function(req, res){
    let job = req.params.job_id;

    if (!job) { return error.parameterErr(res, "Missing job_id parameter"); }

    mysql.pool.query("DELETE FROM jobs WHERE job_id=?", [job], function(err){
        if (err) { return error.sqlErr(res, err); }
        else { return res.status(204).send(); }
    });
};

/***************************************************
 * Name: jobInfo
 * Input: URL param `user_id`
 * Output: all fields associated with corresponding
 * rows in `jobs`
 **************************************************/
exports.jobInfoPerUser = function(req, res){
    let user = req.params.user_id;

    if (!user) { return error.parameterErr(res, "Missing user_id parameter"); }

    mysql.pool.query("SELECT job_id, title, wage, frequency, filing_status, allowances, retirement_percent, pretax_static,"
        + " posttax_static, fed_tax_rate, loc_tax_rate"
        + " FROM jobs"
        + " WHERE user_id = ?", [user], function(err, results){
        if (err) { return error.sqlErr(res, err); }
        else { return res.send(results); }
    });
};

/***************************************************
 * Name: updateJob
 * Input: Body with all fields of jobs table
 * Output: "204 No Content" if successful
 **************************************************/
exports.updateJob = function(req, res){
    //Verify that the request body exists
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    let j = jobInfoPrepper(req.body);

    //Verify the minimum requirements for inserting have been met
    for (let field in j) {
        if (j[field] === null) { return error.parameterErr(res, "Missing required field: " + field); }
    }

    mysql.pool.query("UPDATE jobs"
        + " SET user_id=?, title=?, wage=?, frequency=?, filing_status=?, allowances=?, retirement_percent=?,"
        + " pretax_static=?, posttax_static=?, fed_tax_rate=?, loc_tax_rate"
        + " WHERE job_id=?",
        [j.user, j.title, j.wage, j.frequency, j.filing, j.allowances, j.retirement, j.pretax, j.posttax, j.fed_tax_rate, j.loc_tax_rate, j.job], function(err){
            if (err) { return error.sqlErr(res, err); }
            else { return res.status(204).send(); }
        });
};

/************ HELPER FUNCTIONS BELOW ************/
/**************************************************
 * Name: jobInfoPrepper
 * Input: JSON object of jobs fields
 * Output: JSON object of formatted jobs fields
 *************************************************/
function jobInfoPrepper(body){
    let job = (body.job_id) ? body.job_id : null;
    let user = (body.user_id) ? body.user_id : null;
    let title = (body.title) ? body.title : null;
    let wage = (body.wage) ? body.wage : null;
    let frequency = (body.frequency) ? body.frequency : null;
    let filing = (body.filing) ? body.filing : null;
    let allowances = (body.allowances) ? body.allowances : null;
    let retirement = (body.retirement) ? body.retirement : null;
    let pretax = (body.pretax) ? body.pretax : null;
    let posttax = (body.posttax) ? body.posttax : null;
    let fed_tax_rate = (body.fed_tax_rate) ? body.fed_tax_rate : null;
    let loc_tax_rate = (body.loc_tax_rate) ? body.loc_tax_rate : null;


    return {
        job : job,
        user : user,
        title : title,
        wage : wage,
        frequency : frequency,
        filing : filing,
        allowances : allowances,
        retirement : retirement,
        pretax : pretax,
        posttax : posttax,
        fed_tax_rate : fed_tax_rate,
        loc_tax_rate : loc_tax_rate
    };
}

