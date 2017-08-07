/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
//const playlistStore = require('../models/playlist-store');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const memberprofile = {
  index(request, response) {
    logger.info('memberprofile rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    //const determineBMICategory = analytics.determineBMICategory(loggedInUser.calculateBMI)
    const viewData = {
      title: 'Gym App Member Profile',
      //user: userStore.getUserById(loggedInUser.id),
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render');
    //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
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
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.lastname = request.body.lastname;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateemail(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.email = request.body.email;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updategender(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.gender = request.body.gender;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateheight(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.height = request.body.height;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatestartingweight(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.startingWeight = request.body.startingWeight;

    userStore.store.save();
    response.redirect('/memberprofile');
  },



};

module.exports = memberprofile;