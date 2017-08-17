/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
//const playlistStore = require('../models/playlist-store');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const isTrainer = false;
    //const determineBMICategory = analytics.determineBMICategory(loggedInUser.calculateBMI)
    const viewData = {
      title: 'Users Gym App Dashboard',
      //user: userStore.getUserById(loggedInUser.id),
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      isTrainer: isTrainer,
      //profilepic: analytics.profilepic(loggedInUser),
      //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render');
    //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
    response.render('dashboard', viewData);
  },



  /*deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect('/dashboard');
  },*/

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    //const user = userStore.getUserById(userId);
    const newAssessment =
        {
      assessmentId: uuid(),
      //userid: loggedInUser.id,
      date: request.body.date,
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
    //const loggedInUser = accounts.getCurrentUser(request);

    //const userId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const loggedInUser = accounts.getCurrentUser(request);
    userStore.deleteAssessment(loggedInUser.id, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId}  for ${loggedInUser.firstname}`);
    //userStore.removeAssessment(userId, assessmentId);
    analytics.trend(loggedInUser);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;