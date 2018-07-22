const {con} = require('../db/db')

module.exports = async (req,res) =>{

      var q = "select event_logical_id as id,event_title as title,event_desc as description,event_start_date as start,event_end_date as end from event";
      con.query(q, function (err, result) {

          if (err) {
               console.log(err)
              return res.send({});
              con.end();
          }

          return res.send(result);
          con.end();
      });



}