/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const logger = require('../utils/logger');

const about = {
  index(request, response) {
    logger.info('about rendering');
    const viewData = {
      title: 'About Gym App in JS',
    };
    response.render('about', viewData);
  },
};

module.exports = about;