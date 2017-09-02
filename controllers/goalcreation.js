/**
 * Created by Robert Alexander on 30/08/2017.
 */
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

const goalcreation = {
  index(request, response) {
    logger.info('goalcreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(user);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(user);
    const userBookings = userStore.getAllUserBookings(userId);

    for (let i = 0; i < userBookings.length; i++)
    {
      userBookings[i].trainersBooking = false;

      if (trainerId === userBookings[i].trainerId)
      {
        userBookings[i].trainersBooking = true;
      }

      userStore.save();
    }

    const viewData = {
      title: 'Gym App Trainer Viewing User',
      id: userId,
      user: user,
      trainerId: trainerId,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,
      userBookings: userBookings,
    };
    logger.debug(`View ${user.firstname} assessments`);
    response.render('goalcreation', viewData);
  },

  addGoal(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainersId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const newGoal =
        {
          goalId: uuid(),
          date: request.body.goaldate,
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
    response.redirect('/goalcreation/' + userId);
  },

  deleteGoal(request, response) {
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const goalId = request.params.goalId;
    userStore.deleteGoal(userId, goalId);
    response.redirect('/goalcreation/' + userId);
  },

};

module.exports = goalcreation;
