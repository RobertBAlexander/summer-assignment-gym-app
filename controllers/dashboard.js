/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger'); //const playlistStore = require('../models/playlist-store');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const isTrainer = false; //const determineBMICategory = analytics.determineBMICategory(loggedInUser.calculateBMI)
    const viewData = {
      title: 'Users Gym App Dashboard', //user: userStore.getUserById(loggedInUser.id),
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      isTrainer: isTrainer, //profilepic: analytics.profilepic(loggedInUser), //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render'); //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id; //const user = userStore.getUserById(userId);
    const date = new Date();
    const newAssessment =
        {
      assessmentId: uuid(), //userid: loggedInUser.id,
      date: dateformat(date, 'ddd, dd mmm yyyy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      trend: '',
      comment: '',

    };
    logger.debug('New Assessment', newAssessment);
    userStore.addAssessment(userId, newAssessment);
    analytics.trend(loggedInUser);
    response.redirect('/dashboard/');  //removed 'userId'
  },

  deleteAssessment(request, response)
  {
    const assessmentId = request.params.assessmentId;
    const loggedInUser = accounts.getCurrentUser(request);
    userStore.deleteAssessment(loggedInUser.id, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId}  for ${loggedInUser.firstname}`);
    analytics.trend(loggedInUser);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
