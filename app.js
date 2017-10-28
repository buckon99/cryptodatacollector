/*MAIN PROGRAM FOR CRYPTODATACOLLECTOR*/
var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cryptodata'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/todoListRoutes');

routes(app);


app.listen(port);

console.log('RESTful API server started on: ' + port);