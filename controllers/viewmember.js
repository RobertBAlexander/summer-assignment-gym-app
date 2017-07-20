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

const viewmember = {
  index(request, response) {
    logger.info('viewmember rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);

    const viewData = {
      title: 'Gym App Trainer Viewing Member',

      trainer: loggedInTrainer,

    };
    logger.info('about to render');
    response.render('viewmember', viewData);
  },




};

module.exports = viewmember;