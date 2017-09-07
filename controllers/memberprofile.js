/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const pictureStore = require('../models/picture-store.js');
const dateformat = require('dateformat');

const memberprofile = {
  index(request, response) {
    logger.info('memberprofile rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const viewData = {
      title: 'Gym App Member Profile',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
    };
    logger.info('about to render');
    response.render('memberprofile', viewData);
  },

  updatefname(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.firstname = request.body.firstname;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatelname(request, response)
  {
    logger.info('rendering update of last name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.lastname = request.body.lastname;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateemail(request, response)
  {
    logger.info('rendering update of email');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.email = request.body.email;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatepicture(request, response)
  {
    logger.info('updating profile picture rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const picture = request.files.picture;

    userStore.addPicture(loggedInUser, picture, function () {
          logger.debug(`updating ${loggedInUser.firstname}'s picture`);
          userStore.store.save();
          response.redirect('/memberprofile');
        }
    );
  },

  updategender(request, response)
  {
    logger.info('rendering update of gender');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.gender = request.body.gender;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateheight(request, response)
  {
    logger.info('rendering update of height');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.height = request.body.height;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatestartingweight(request, response)
  {
    logger.info('rendering update of starting weight');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.startingWeight = request.body.startingWeight;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

};

module.exports = memberprofile;
