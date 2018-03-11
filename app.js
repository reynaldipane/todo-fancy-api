const express         = require('express');
const path            = require('path');
const bodyParser      = require('body-parser');
const index           = require('./routes/index');
const mongoose        = require('mongoose');
const cors            = require('cors')
const app             = express();

require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/todofancy')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.use('/', index);


module.exports = app;