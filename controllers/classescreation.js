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

const classescreation = {
  index(request, response) {
    logger.info('classescreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classesList = classes.getAllClasses();

    const viewData = {
      title: 'Gym App Trainer Creating Scheduled Classes',

      trainer: loggedInTrainer,
      classesList: classesList,

    };
    logger.info('about to render');
    response.render('classescreation', viewData);
  },

  addClass(request, response) {
    const newClass = {
      classId: uuid(),
      class
    }
  }




};

module.exports = classescreation;