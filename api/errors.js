/**************************************************
 * Name: parameterErr
 * Description: Returns 400-errors with a specified
 * error message.
 * Input: The `err` parameter (user provided string)
 * and the `res` parameter for the request.
 *************************************************/
exports.parameterErr = function(res, err){
    return res.status(400).send(err);
};

/**************************************************
 * Name: sqlErr
 * Description: Returns MySQL error to the client.
 * Input: The `err` parameter from a MySQL query and
 * the `res` parameter for the request.
 *************************************************/
exports.sqlErr = function(res, err){
    return res.status(500).send("MySQL error: " + err);
};