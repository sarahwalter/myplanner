const http = require('http')
const https = require('https')
const fs = require('fs')

const app = require('./app')
const constants = require('constants')

if(process.env.NODE_ENV === "development"){

    app.listen(process.env.PORT,()=>{console.log(`server fired on ${process.env.PORT}`)})
    return;

}


http.createServer(function(req, res) {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(process.env.PORT);


https.createServer({
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
    dhparam: fs.readFileSync(process.env.ssldhparam),
    key: fs.readFileSync(process.env.sslkey),
    cert: fs.readFileSync(process.env.sslcert),
    ca: fs.readFileSync(process.env.sslca),
}, app).listen(process.env.HTTPSPORT);

