//process.env.NODE_ENV = "production"
process.env.NODE_ENV = "development"

require('./config/config')
//require('./db/db')
const express = require('express')
const routes = require('./routes/routes')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
var session  = require('express-session')

const app = express()

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        inc: function (value, options) { return parseInt(value) + 1; }
    }
});

app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/'}))
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(session({
    secret:'hgj4jh%%^^@##!#$!$2627',
    saveUninitialized:true,
    resave:true,
}))
app.use(express.static(__dirname + '/views/'));


routes(app)

module.exports = app