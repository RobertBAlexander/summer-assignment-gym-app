/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const logger = require('../utils/logger');

const start = {
  index(request, response) {
    logger.info('start rendering');
    const viewData = {
      title: 'Welcome to the summer gym app assignment',
    };
    response.render('start', viewData);
  },
};

module.exports = start;