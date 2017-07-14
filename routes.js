'use strict';

const express = require('express');
const router = express.Router();

//const start = require('./controllers/start');
const dashboard = require('./controllers/dashboard.js');
//const playlist = require('./controllers/playlist.js');
const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

//router.get('/profile', profile.index);
//router.post('/updateprofile', profile.updateprofile);

router.get('/dashboard', dashboard.index);
router.post('/dashboard/addassessment', dashboard.addAssessment);
//router.get('/dashboard/deleteplaylist/:id', dashboard.deletePlaylist);
//router.post('/dashboard/addplaylist', dashboard.addPlaylist);

router.get('/about', about.index);
//router.get('/playlist/:id', playlist.index);
//router.get('/playlist/:id/deletesong/:songid', playlist.deleteSong);
//router.post('/playlist/:id/addsong', playlist.addSong);

module.exports = router;
