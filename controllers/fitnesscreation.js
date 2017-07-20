/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const fitnesscreation = {
  index(request, response) {
    logger.info('fitnesscreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);

    const viewData = {
      title: 'Gym App Trainer Creating Fitness Programmes',

      trainer: loggedInTrainer,

    };
    logger.info('about to render');
    response.render('fitnesscreation', viewData);
  },




};

module.exports = fitnesscreation;