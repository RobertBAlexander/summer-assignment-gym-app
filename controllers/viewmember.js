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
    response.render('viewmember', viewData);
  },

  deleteAssessment(request, response) {
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const assessmentId = request.params.assessmentId; //const viewmember = userStore.getUserById(userId);
    userStore.deleteAssessment(userId, assessmentId);
    analytics.trend(user); //logger.debug(`Deleting Assessment ${assessmentId} for member ${userId}`);
    response.redirect('/viewmember/' + userId);
  },

  updateComment(request, response) {
    const userId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const comment = request.body.comment;
    const assessmentToUpdate = userStore.getAssessment(userId, assessmentId);
    assessmentToUpdate.comment = comment;
    userStore.save();
    response.redirect('/viewmember/' + userId);
  },

  deleteBooking(request, response)
  {
    const userId = request.params.id;
    const bookingId = request.params.bookingId;
    userStore.deleteBooking(userId, bookingId);
    response.redirect('/viewmember/' + userId);
  },

  updateBooking(request, response)
  {
    const userId = request.params.id;
    const bookingId = request.params.bookingId;
    const date = request.body.date;
    const time = request.body.time;
    const bookingToUpdate = userStore.getBookingById(userId, bookingId);
    bookingToUpdate.date = date;
    bookingToUpdate.time = time;
    userStore.save();
    response.redirect('/viewmember/' + userId);
  },

  performBookedAssessment(request, response)
  {
    logger.info('performBookedAssessment rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainersId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(user);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(user); //const userBookings = userStore.getAllUserBookings(userId);
    const bookingId = request.params.bookingId;
    const performingBooking = userStore.getBookingById(userId, bookingId);
    const viewData = {
      title: 'Gym App Trainer Viewing User',
      id: userId,
      user: user,
      trainersId: trainersId,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,
      bookingId: bookingId, //userBookings: userBookings,
      performingBooking: performingBooking,

    };
    logger.debug(`View ${user.firstname} assessments`);

    response.render('performBookedAssessment', viewData);
  },

  addBookedAssessment(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainersId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const bookingId = request.params.bookingId;
    const performingBooking = userStore.getBookingById(userId, bookingId);
    const date = performingBooking.date;
    const newAssessment =
        {
          assessmentId: bookingId, //userid: loggedInUser.id,
          date: date,
          weight: request.body.weight,
          chest: request.body.chest,
          thigh: request.body.thigh,
          upperArm: request.body.upperArm,
          waist: request.body.waist,
          hips: request.body.hips,
          trend: '',
          comment: request.body.comment,

        };
    logger.debug('New Assessment', newAssessment);
    userStore.addAssessment(userId, newAssessment);
    userStore.deleteBooking(userId, bookingId);
    analytics.trend(user); //analytics.trend(user);
    response.redirect('/viewmember/' + userId);
  },

};

module.exports = viewmember;
