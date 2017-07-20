/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
//const playlistStore = require('../models/playlist-store');
const userStore = require('../models/user-store');
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



  /*deletePlaylist(request, response) {
   const playlistId = request.params.id;
   logger.debug(`Deleting Playlist ${playlistId}`);
   playlistStore.removePlaylist(playlistId);
   response.redirect('/dashboard');
   },*/


};

module.exports = memberprofile;