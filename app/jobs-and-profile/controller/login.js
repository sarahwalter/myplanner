const {con} = require('../db/db')
module.exports = async (req, res) => {

    let {username, password} = req.body;

    let qs1 = "select Count(*) as total,fname,id,email from users where email='"+username+"' and pwd ='"+password+"'";

    await  con.query(qs1, async (err, result) => {

        if(result[0].total  > 0){

            req.session.user = {fname:result[0].fname,id:result[0].id} ;

            return  res.redirect('profile');
            con.end();

        }
        return  res.render('index',{title:'Profile',err:'true',post:"err"});

    });

}