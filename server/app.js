var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var CronJob = require('cron').CronJob;
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var job = new CronJob('*/2 * * * *', function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', function () {
    console.log("couldn't connect to db");
});

db.once('open', function () {
    console.log("db connected")
});

function readInput() {
    fs.createReadStream('./assets/input.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
            // [
            //   { NAME: 'Daffy Duck', AGE: '24' },
            //   { NAME: 'Bugs Bunny', AGE: '22' }
            // ]
        });
}

//readInput()
module.exports = app;
