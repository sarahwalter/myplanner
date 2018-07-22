const addevent = require('../controller/add')
const del = require('../controller/delete')
const update = require('../controller/update')
const al = require('../controller/getevents')
const login = require('../controller/login')
const signup = require('../controller/signup')
const {getProfile,postProfile} = require('../controller/profile')
const {getJobs,postJob,updateJob,delJobs} = require('../controller/myjobs')

module.exports = app => {

    app.get('/', (req, res) => {
        res.render('index',{title:'Home'});
    })

    app.get('/signup', (req, res) => {
        res.render('signup',{title:'/signup'});
    })


    app.get('/profile',getProfile);


    app.get('/logout', (req, res) => {

        req.session.user = null;
        return res.redirect("/");
    })

    app.post('/profile',postProfile);


    app.get('/jobs', getJobs);
    app.post('/postjob', postJob);
    app.post('/updatejob', updateJob);
    app.get('/deletejob/:id', delJobs);


    app.post('/signup',signup);





    app.post('/',login);

    app.post('/update',update);
    app.get('/delete/:id',del);
    app.get('/all',al);
}