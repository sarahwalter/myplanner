const {con} = require('../db/db')


var getProfile = async (req, res) => {


    if(req.session.user) {

        let qs = "select * from users where id='"+req.session.user.id+"'";
        await con.query(qs, (err, result) => {

            return res.render('profile', {title: 'Profile', user: req.session.user.fname,
                                                            fname:result[0].fname,
                                                            email:result[0].email,
                                                            pwd:result[0].pwd,
                                                            lname:result[0].lname});
            con.end();

        })

    }else return res.redirect("/");



}


var postProfile = async (req, res) => {


    let {fname,lname,email,pwd} = req.body;

    let qs = "update users set fname='"+fname+"', lname='"+lname+"', email='"+email+"', pwd='"+pwd+"' where id='"+req.session.user.id+"'";

    await  con.query(qs, async (err, result) => {


        if(err) {

            return res.redirect("profile");
            con.end();
        } else {
           return  res.redirect("profile");
            con.end();
        }

    })


}


module.exports = {getProfile,postProfile}