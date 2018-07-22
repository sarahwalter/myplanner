const {con} = require('../db/db')

module.exports = async (req,res) =>{


    var q = "delete from event where event_logical_id='"+req.params.id+"'" ;
    con.query(q, function (err, result) {

        if (err) {
            console.log(err)
            return res.send({});
            con.end();

        }
        return res.send("done");
        con.end();
    });


}