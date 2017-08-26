/**
 * Created by Robert Alexander on 26/08/2017.
 */
'use strict';

const hbs = require('hbs');
const express = require('express');

hbs.registerHelper('dateFormat', require('handlebars-dateformet'));

const app = express();

app.set('view engine', 'hbs');

app.get('/', function (req,res) {
  res.render('index', {now: new Date() });
});
app.listen(4000);

module.exports = app;