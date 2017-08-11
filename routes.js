'use strict';

const express = require('express');
const router = express.Router();


const dashboard = require('./controllers/dashboard.js');
const memberprofile = require('./controllers/memberprofile.js');
const bookings = require('./controllers/bookings.js');
const goals = require('./controllers/goals.js');

const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');

const trainerdashboard = require('./controllers/trainerdashboard.js');
const viewmember = require('./controllers/viewmember.js');
const classescreation = require('./controllers/classescreation.js');
const fitnesscreation = require('./controllers/fitnesscreation.js');


router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);



router.get('/dashboard', dashboard.index);
router.post('/dashboard/addAssessment', dashboard.addAssessment);
router.get('/dashboard/deleteAssessment/:assessmentId', dashboard.deleteAssessment);

router.get('/memberprofile', memberprofile.index);
router.post('/memberprofile/updatefname', memberprofile.updatefname);
router.post('/memberprofile/updatelname', memberprofile.updatelname);
router.post('/memberprofile/updateemail', memberprofile.updateemail);
router.post('/memberprofile/updatepicture', memberprofile.updatepicture);
router.post('/memberprofile/updategender', memberprofile.updategender);
router.post('//memberprofile/updateheight', memberprofile.updateheight);
router.post('/memberprofile/updatestartingweight', memberprofile.updatestartingweight);

router.get('/bookings', bookings.index);
//router.get('/classes', classes.index);
router.get('/goals', goals.index);
//router.get('/fitness', fitness.index);

router.get('/about', about.index);
//router.get('/assessment/:id', assessment.index);



router.get('/trainerdashboard', trainerdashboard.index);
router.get('/trainerdashboard/deleteuser/:id', trainerdashboard.deleteuser);

router.get('/viewmember/:id', viewmember.index);
router.get('/viewmember/:id/deleteassessment/:assessmentId', viewmember.deleteAssessment);
router.post('/viewmember/:id/updateComment/:assessmentId', viewmember.updateComment);

router.get('/classescreation', classescreation.index);
router.get('/fitnesscreation', fitnesscreation.index);

module.exports = router;
