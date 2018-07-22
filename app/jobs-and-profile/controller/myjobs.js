const {con} = require('../db/db')

var getJobs = async (req, res) => {

    if(req.session.user) {

        let qs = "select * from users_job where userid='"+req.session.user.id+"' order by id desc";
        await con.query(qs, (err, result) => {

            console.log(result);

            return res.render('jobs', {title: 'My Jobs', result: result, 
                helpers: {
                                inc: function (value, options) { return parseInt(value) + 1; }
                            }
            });
                                                            
            con.end();

        })

    }else return res.redirect("/");

}

var postJob = async (req, res) => {
    if(req.session.user) {
        let {title,payrate} = req.body;
        var qs = "insert into users_job (userid,title,payrate) values('"+
                req.session.user.id+"', '"+title+"', '"+payrate+"')";

         await  con.query(qs, function (err, result) {
            if (err) {
                return res.redirect("jobs");
                con.end();
            } else {
                return res.redirect("jobs");
                con.end();
            }   
        });

    } else 
        return res.redirect("/");
}

var updateJob = async (req, res) => {
    if(req.session.user) {

        let {title,payrate,jobid} = req.body;
        
        let qs = "update users_job set title='"+title+"', payrate='"+payrate+"' where id='"+jobid+"'";
        
        await  con.query(qs, function (err, result) {
            if (err) {
                return res.redirect("jobs");
                con.end();
            } else {
                return res.redirect("jobs");
                con.end();
            }   
        });           

    }else return res.redirect("/");
}

var delJobs = async (req, res) => {
    if(req.session.user) {

        let id = req.params.id;
        
        let qs = "delete from users_job where id='"+id+"'";
        
        await  con.query(qs, function (err, result) {
            if (err) {
                return res.redirect("/jobs");
                con.end();
            } else {
                return res.redirect("/jobs");
                con.end();
            }   
        });           

    }else return res.redirect("/");
}


module.exports = {getJobs,postJob,updateJob,delJobs}