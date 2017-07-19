/**
 * Created by Robert Alexander on 19/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const userStore = require('../models/user-store');
const accounts = require('./accounts.js');
const dashboard = require('./dashboard.js');
const analytics = require('../utils/analytics.js');

const bookings = {
  index(request, response) {
    logger.info('bookings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const viewData = {
      title: 'Gym App Bookings',
      user: loggedInUser,
      //calculateBMI: calculateBMI,
      //determineBMICategory: analytics.determineBMICategory(calculateBMI),
      //idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render');
    //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
    response.render('bookings', viewData);
  },



};

module.exports = bookings;