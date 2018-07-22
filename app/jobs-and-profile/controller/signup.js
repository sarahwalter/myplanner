const {con} = require('../db/db')


module.exports = async (req,res) => {

    let {fname,lname,email,pwd} = req.body;


       let qs1 = "select Count(*) as total from users where email='"+email+"'";


        await  con.query(qs1, async (err, result) => {


                if(result[0].total > 0){

                    return  res.render('signup',{title:'Signup',emailerr:"true",post:"true"});

                }

            var qs = "insert into users (fname,lname,email,pwd) values('"+
                fname+"','"+lname+"','"+email+"','"+pwd+"')";


             await  con.query(qs, function (err, result) {
                if (err)
                    return  res.render('signup',{title:'Signup',err:"true",post:"true"});

                return  res.render('signup',{title:'Signup',post:"true"});

                con.end();
            });



        });






}