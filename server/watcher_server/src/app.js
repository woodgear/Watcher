const express = require('express');
const bodyParser = require('body-parser')

const WP = require('./controller/windowsProgramReportContrller');

const app = express();

app.use(bodyParser.json())

app.post('/api/v1/reporter/windows_program', (req, res) => {
    new WP(req, res).create();
})

app.get('/api/v1/reporter/windows_program', (req, res) => {
    new WP(req, res).get();
})

app.listen(3000,()=>{
    console.log('create server start on 3000');
});