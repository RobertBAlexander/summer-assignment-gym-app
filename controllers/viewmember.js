/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

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
    const listUsers = userStore.getAllUsers();

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
      listUsers: listUsers,

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

  addBooking(request, response)
  {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const listUsers = userStore.getAllUsers();
    const currentUser = userStore.getUserById(userId);
    const trainerFirstName = loggedInTrainer.firstname;
    const trainerLastName = loggedInTrainer.lastname;
    const trainerFullName = trainerFirstName + ' ' + trainerLastName;
    const userFullName = currentUser.firstname + ' ' + currentUser.lastname;
    const date = request.body.date;
    logger.debug('trainer id', request);
    const newBooking =
        {
          bookingId: uuid(),
          userFullName: userFullName,
          trainerFullName: trainerFullName,
          trainerId: trainerId,
          userId: userId,
          date: dateformat(date, 'ddd, dd mmm yyyy'),
          time: request.body.time,
        };

    const userList = userStore.getAllUsers();
    let availableTime = true;
    for (let i = 0; i < userList.length; i++)
    {
      let thisUserId = userList[i].id;
      let bookingList = userStore.getAllUserBookings(thisUserId);
      for (let j = 0; j < bookingList.length; j++)
      {
        logger.debug(newBooking.date === bookingList[j].date);
        if ((newBooking.date.toString() === bookingList[j].date) && (newBooking.time === bookingList[j].time)
            && (newBooking.trainerId === bookingList[j].trainerId))
        {
          availableTime = false;
          logger.debug('available time SHOULD BE FALSE');
          break;
        }
      }
    }

    if (availableTime)
    {
      logger.debug('New Booking', availableTime);
      userStore.addBooking(userId, newBooking);
    } else
    {
      logger.debug(`A booking is already taking place at this time with this trainer.`);
    }

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
    bookingToUpdate.date = dateformat(date, 'ddd, dd mmm yyyy');
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
    analytics.trend(user);

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
          date: dateformat(date, 'ddd, dd mmm yyyy'),
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
    analytics.trend(user);
    userStore.save();
    response.redirect('/viewmember/' + userId);
  },

};

module.exports = viewmember;
