/**
 * Created by Robert Alexander on 24/08/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store.js');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const searches = require('../utils/searches.js');
const classStore = require('../models/class-store.js');
const dateformat = require('dateformat');

const membersbookings = {
  index(request, response) {
    logger.info('membersbookings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const searchedClasses = classStore.getAllClasses();
    const listTrainers = trainerStore.getAllTrainers();
    const listBookings = loggedInUser.bookings;

    const viewData = {
      title: 'Gym App Member Book Assessments',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      searchedClasses: searchedClasses,
      listTrainers: listTrainers,
      listBookings: listBookings, //trainerName: trainerName,
    };
    logger.info('about to render bookings', userId);
    response.render('membersbookings', viewData);
  },

  addBooking(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    const trainerId = request.body.trainerId;
    const currentTrainer = trainerStore.getTrainerById(trainerId);
    const userFirstName = loggedInUser.firstname;
    const userLastName = loggedInUser.lastname;
    const userFullName = userFirstName + ' ' + userLastName;
    const date = request.body.date;
    logger.debug('trainer id', request);
    const newBooking =
        {
          bookingId: uuid(),
          trainerName: request.body.trainerName,
          userFullName: userFullName,
          userId: userId,
          trainerId: request.body.trainerId,
          date: dateformat(date, 'ddd, dd mmm yyyy'),
          time: request.body.time,
        };

    const userList = userStore.getAllUsers();
    let availableTime = true;
    let counter = 0;
    for (let i = 0; i < userList.length; i++)
    {
      let thisUserId = userList[i].id;
      let bookingList = userStore.getAllUserBookings(thisUserId);
      for (let j = 0; j < bookingList.length; j++)
      {
        if (newBooking.date === bookingList[j].date)// && (newBooking.time === bookingList[j].time)
           // && (newBooking.trainerId === bookingList[j].trainerId))
        {
          availableTime = false;
          counter += 1;

        }
      }
    }

    if (availableTime = true)
    {
      logger.debug('New Booking', counter);
      userStore.addBooking(userId, newBooking);
    } else
    {
      logger.debug(`A booking is already taking place at this time with this trainer.`, counter);
    }

    response.redirect('/membersbookings/');
  },

  deleteBooking(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const bookingId = request.params.bookingId;
    const userId = loggedInUser.id;
    userStore.deleteBooking(userId, bookingId);

    response.redirect('/membersbookings/');
  },

  updateBooking(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    const bookingId = request.params.bookingId;
    const bookingToUpdate = userStore.getBookingById(userId, bookingId);
    const trainerId = request.body.trainerId;
    const date = request.body.date;
    const time = request.body.time;
    bookingToUpdate.trainerId = trainerId;
    bookingToUpdate.date = dateformat(date, 'ddd, dd mmm yyyy');
    bookingToUpdate.time = time;
    userStore.save();
    response.redirect('/membersbookings/');
  },

};

module.exports = membersbookings;
