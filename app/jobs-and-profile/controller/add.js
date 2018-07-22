const {con} = require('../db/db')

module.exports = async (req,res) =>{

    console.log("add"+ req.body);


    var {id,start,end,title,description} = req.body;

    var qs = "insert into event (event_logical_id,event_title,event_desc,event_start_date,event_end_date) values('"+
        id+"','"+title+"','"+description+"','"+start+"','"+end+"')";



       await con.query(qs, function (err, result) {
           if (err) throw err;
           console.log("1 record inserted");
           con.end();
       });



   // var event = await  new Event({id, start,end, title, description})
     //   await event.save()

    res.send("done")

}