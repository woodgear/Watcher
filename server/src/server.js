const express = require('express');
var bodyParser = require('body-parser')
const control = require('./control.js');

const HTTP_PORT = require('./config.js').HTTP_PORT


const app = express();
app.use(bodyParser.json());

app.post("/api/report", (req, res) => {
    //new control(rep, res).save();
    console.log(JSON.stringify(req.body));
    res.json({status:"ok"});
});


app.listen(HTTP_PORT);
console.log(`app listen in ${HTTP_PORT}`)
