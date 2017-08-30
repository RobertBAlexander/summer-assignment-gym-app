/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger'); //const playlistStore = require('../models/playlist-store');
const trainerStore = require('../models/trainer-store.js');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const trainerdashboard = {
  index(request, response) {
    logger.info('trainerdashboard rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const userList = userStore.getAllUsers();
    const viewData = {
      title: 'Gym App Trainer Dashboard',
      trainer: loggedInTrainer,
      userList: userList,
    };
    logger.info('about to render');
    response.render('trainerdashboard', viewData);
  },

  deleteuser(request, response)
  {
    logger.info('rendering deletion of user');
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = request.params.id;
    logger.debug(`Deleting User ${userId.firstname} ${userId}`);
    userStore.deleteUser(userId);
    response.redirect('/trainerDashboard');
  },

};

module.exports = trainerdashboard;
