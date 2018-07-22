const {con} = require('../db/db')

module.exports = async (req,res) =>{


    var q = "update event set event_title='"+req.body.title+"',event_desc='"
                                            +req.body.description+"' where "
                                            +"event_logical_id='"+req.body.id+"'";

    console.log(q)

    con.query(q, function (err, result) {

        if (err) {
            console.log(err)
            return res.send({});
            con.end();

        }

        return res.send("updated");
        con.end();
    });

}