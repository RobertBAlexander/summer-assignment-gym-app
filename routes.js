'use strict';

const express = require('express');
const router = express.Router();


const dashboard = require('./controllers/dashboard.js');
const memberprofile = require('./controllers/memberprofile.js');
const membersbookings = require('./controllers/membersbookings.js');
const goals = require('./controllers/goals.js');

const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');

const trainerdashboard = require('./controllers/trainerdashboard.js');
const viewmember = require('./controllers/viewmember.js');
const classescreation = require('./controllers/classescreation.js');
const fitnesscreation = require('./controllers/fitnesscreation.js');
const membersclasses = require('./controllers/membersclasses.js');


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

router.get('/membersclasses', membersclasses.index);
router.get('/membersclasses/:classId/attendLesson/:lessonId', membersclasses.lessonAttend);
router.get('/membersclasses/:classId/leaveLesson/:lessonId', membersclasses.leaveLesson);
router.get('/membersclasses/classAttend/:classId', membersclasses.classAttend);
router.get('/membersclasses/leaveClass/:classId', membersclasses.leaveClass);

router.get('/membersbookings', membersbookings.index);
router.post('/membersbookings/addBooking', membersbookings.addBooking);
router.get('/membersbookings/deleteBooking/:bookingId', membersbookings.deleteBooking);
router.post('/membersbookings/:userId/updateBooking/:bookingId', membersbookings.updateBooking);


router.get('/trainerdashboard', trainerdashboard.index);
router.get('/trainerdashboard/deleteuser/:id', trainerdashboard.deleteuser);

router.get('/viewmember/:id', viewmember.index);
router.get('/viewmember/:id/deleteAssessment/:assessmentId', viewmember.deleteAssessment);
router.post('/viewmember/:id/updateComment/:assessmentId', viewmember.updateComment);
router.get('/viewmember/:id/deleteBooking/:bookingId', viewmember.deleteBooking);
router.post('/viewmember/:id/updateBooking/:bookingId', viewmember.updateBooking);
router.get('/viewmember/:id/performBookedAssessment/:bookingId', viewmember.performBookedAssessment);
router.post('/viewmember/:id/addBookedAssessment/:bookingId', viewmember.addBookedAssessment);

router.get('/classescreation', classescreation.index);
router.post('/classescreation/addClass', classescreation.addClass);
router.get('/classescreation/deleteClass/:classId', classescreation.deleteClass);
router.get('/classescreation/:classId/deleteLesson/:lessonId', classescreation.deleteLesson);
router.post('/classescreation/updateClassName/:classId', classescreation.updateClassName);
router.post('/classescreation/updateClassCapacity/:classId', classescreation.updateClassCapacity);
router.post('/classescreation/updateClassDifficulty/:classId', classescreation.updateClassDifficulty);
router.post('/classescreation/:classId/updateLessonStart/:lessonId', classescreation.updateLessonStart);
router.post('/classescreation/:classId/updateDuration/:lessonId', classescreation.updateDuration);


//router.get('/classes', classes.index);
router.get('/goals', goals.index);
//router.get('/fitness', fitness.index);

router.get('/about', about.index);
//router.get('/assessment/:id', assessment.index);









router.get('/fitnesscreation', fitnesscreation.index);

module.exports = router;
