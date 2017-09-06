/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const userStore = require('../models/user-store');
const accounts = require('./accounts.js');
const dashboard = require('./dashboard.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

const membergoals = {
  index(request, response) {
    logger.info('goals rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const viewData = {
      title: 'Gym App goals',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
    };
    logger.info('about to render');
    response.render('membergoals', viewData);
  },

  addGoal(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    const user = userStore.getUserById(userId);
    const date = request.body.goaldate;
    const newGoal =
        {
          goalId: uuid(),
          date: dateformat(date, 'ddd, dd mmm yyyy'),
          weight: request.body.weight,
          aboveorWeight: request.body.aboveorWeight,
          chest: request.body.chest,
          aboveorChest: request.body.aboveorChest,
          thigh: request.body.thigh,
          aboveorThigh: request.body.aboveorThigh,
          upperArm: request.body.upperArm,
          aboveorArm: request.body.aboveorArm,
          waist: request.body.waist,
          aboveorWaist: request.body.aboveorWaist,
          hips: request.body.hips,
          aboveorHips: request.body.aboveorHips,
          description: request.body.description,
          goalStatus: 'open',

        };
    logger.debug('New Goal', newGoal);
    userStore.addGoal(userId, newGoal);
    response.redirect('/membergoals/');
  },

  deleteGoal(request, response)
  {
    const goalId = request.params.goalId;
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    userStore.deleteGoal(userId, goalId);
    logger.debug(`Deleting Goal ${goalId}  for ${loggedInUser.firstname}`);
    response.redirect('/membergoals');
  },

};

module.exports = membergoals;
