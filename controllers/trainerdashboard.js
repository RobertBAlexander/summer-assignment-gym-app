/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
//const playlistStore = require('../models/playlist-store');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const trainerdashboard = {
  index(request, response) {
    logger.info('trainerdashboard rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    //const calculateBMI = analytics.calculateBMI(loggedInUser);
    //const determineBMICategory = analytics.determineBMICategory(loggedInUser.calculateBMI)
    const viewData = {
      title: 'Gym App Trainer Dashboard',
      //user: userStore.getUserById(loggedInUser.id),
      trainer: loggedInTrainer,
      //calculateBMI: calculateBMI,
      //determineBMICategory: analytics.determineBMICategory(calculateBMI),
      //idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render');
    //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
    response.render('trainerdashboard', viewData);
  },



  /*deletePlaylist(request, response) {
   const playlistId = request.params.id;
   logger.debug(`Deleting Playlist ${playlistId}`);
   playlistStore.removePlaylist(playlistId);
   response.redirect('/dashboard');
   },*/

  /*
  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    //const user = userStore.getUserById(userId);
    const newAssessment =
        {
          id: uuid(),
          //userid: loggedInUser.id,
          weight: request.body.weight,
          chest: request.body.chest,
          thigh: request.body.thigh,
          upperArm: request.body.upperArm,
          waist: request.body.waist,
          hips: request.body.hips,
        };
    logger.debug('New Assessment =', newAssessment);
    userStore.addAssessment(userId, newAssessment);
    response.redirect('/dashboard/');  //removed 'userId'
  },

  deleteAssessment(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const assessmentId = request.params.id;
    const userId = loggedInUser.id;
    logger.debug(`Deleting Assessment ${assessmentId}`);
    userStore.removeAssessment(userId, assessmentId);
    response.redirect('/dashboard');
  },*/

};

module.exports = trainerdashboard;