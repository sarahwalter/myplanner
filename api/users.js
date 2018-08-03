const mysql = require('./dbcon.js');
const error = require('./errors.js');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/***************************************************
 * Name: authenticateUser
 * Input: Body with all none PK fields of user
 * Output: "201 Created" if successful
 * Notes: Bcrypt citation http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/
 **************************************************/
exports.authenticateUser = function(req, res){
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    var u = userInfoPrepper(req.body);
    console.log(u);
    /* Check if first and last are undefined = LOGIN */
    if (u.first == undefined && u.last == undefined) {
        mysql.pool.query("SELECT * FROM users WHERE email_address = ?", [u.email], function(err, results){
        if(err) {  return error.sqlErr(results, err); }
        else {
            var numRows = results.length;
            if(numRows === 0){res.status(400).send("Username or password is not correct")}
            else {
                bcrypt.compare(u.password, results[0].password_hash, function(err, match){
                if(err){ console.log("oops")}
                console.log(match);
                if(match){
                    console.log("passwords match");
                    /* Send user credentials */
                var credentials = { username: u.email, user_id: results[0].user_id};
                res.send(credentials);
                }
                else {
                   res.status(400).send("Username or password is not correct"); 
                }
                });
            }
        }
        });
    }
        
    /* REGISTER */
    else {
        /* Ensure email address is unique */
        mysql.pool.query("SELECT email_address FROM users WHERE email_address = ?", [u.email], function(err, results){
        if(err) {return error.sqlErr(results, err); }
        else {
            var numRows = results.length;
            
            /* Create user */
            if (numRows == 0 ) {
                bcrypt.hash(u.password, SALT_ROUNDS).then(function(hashedPassword){
                   mysql.pool.query("INSERT INTO users (first_name, last_name, email_address, password_hash) VALUES (?,?,?,?)",
                    [u.first, u.last, u.email, hashedPassword], function(err, results){
                        if (err) { return error.sqlErr(res, err); }
                        else { 
                            /* Send user credentials */
                            var credentials = { username: u.email, user_id: results.insertId};
                            res.send(credentials); }
                            }); 
                });
                
            }
            /* Otherwise send error message */
            else {
                res.status(400).send("Oops email address is already in use");
            }
        }
    });
    }
};

/***************************************************
 * Name: deleteUser
 * Input: URL param `user_id`
 * Output: "204 No Content" if successful
 **************************************************/
exports.deleteUser = function(req, res){
    var user = req.params.user_id;

    if (!user) { return error.parameterErr(res, "Missing user_id parameter"); }

    mysql.pool.query("DELETE FROM users WHERE user_id = ?", [user], function(err){
        if (err) { return error.sqlErr(res, err); }
        else { res.status(204).send(); }
        })
};

/***************************************************
 * Name: updateUser
 * Input: Body with every field of `users`
 * Output: "204 No Content" if successful
 **************************************************/
exports.updateUser = function(req, res){
    if (!req.body) { return error.parameterErr(res, "Missing body of request"); }

    var u = userInfoPrepper(req.body);

    if (!u.first || !u.last || !u.email || !u.password) { return error.parameterErr(res, "Missing required fields"); }
    mysql.pool.query("UPDATE users SET first=?, last=?, email=?, password=?", [u.first, u.last, u.email, u.password], function(err){
        if (err) { error.sqlErr(res, err); }
        else { res.status(204).send(); }
    })
};

/***************************************************
 * Name: userInfo
 * Input: URL param `user_id`
 * Output: All related fields for specified user_id
 **************************************************/
exports.userInfo = function(req, res){
    var user = req.params.user_id;

    if (!user) { return error.parameterErr(res, "Missing user_id parameter"); }

    mysql.pool.query("SELECT first_name, last_name, email_address"
    + " FROM users"
    + " WHERE user_id=?", [user], function(err, results){
        if(err) { return error.sqlErr(res, err); }
        else { return res.send(results); }
    });
};

/************ HELPER FUNCTIONS BELOW ************/
/**************************************************
 * Name: userInfoPrepper
 * Input: JSON object of users fields
 * Output: JSON object users fields
 *************************************************/
function userInfoPrepper(body){
    //No tuple vars since all are required and undefined will be caught in validation as well
    var first = body.first_name;
    var last = body.last_name;
    var email = body.email_address;
    var password = body.password;

    return {
        first : first,
        last : last,
        email : email,
        password : password
    }
}

