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

const membersbookings = {
  index(request, response) {
    logger.info('membersbookings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const searchedClasses = classStore.getAllClasses();
    const listTrainers = trainerStore.getAllTrainers();
    const listBookings = loggedInUser.bookings;


    /*for (let j = 0; j < listBookings; j++)
    {
      let trainerId = listBookings[j].trainerId;
      let bookedTrainer = trainerStore.getTrainerById(trainerId);
      let trainerName = bookedTrainer.trainerName;

      //for (let i = 0; i < trainerStore.trainers.length; i++)
      //{
      //  if (trainerStore.trainers[i].id === listBookings[j].trainerId)
      //  {
      //    let trainer = trainerStore.getTrainerById(listBookings[j].trainerId);
      //    let trainerName = trainer.firstname;
      //    return trainerName;
      //  }
      //}
    }*/

    //const trainerClassId = searchedClasses.trainerId;
    //const statusOfLesson = searches.statusOfLesson(loggedInUser);
    //const trainer = trainerStore.getTrainerById(trainerClassId);
    //const classId = request.params.classId;
    //const lessonId = request.params.lessonId;

    const viewData = {
      title: 'Gym App Member Book Assessments',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      searchedClasses: searchedClasses,
      listTrainers: listTrainers,
      listBookings: listBookings,
      //trainerName: trainerName,
      //trainerName: trainerName,
      //trainer: trainer,

    };
    logger.info('about to render bookings', userId);
    response.render('membersbookings', viewData);
  },

  addBooking(request, response)
  {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id;
    //const trainerId = request.body.trainerId;
    //const currentTrainer = trainerStore.getTrainerById(trainerId);
    const userFirstName = loggedInUser.firstname;
    const userLastName = loggedInUser.lastname;
    const userFullName = userFirstName + ' ' + userLastName;
    //const trainerFname = currentTrainer.firstname;
    //const trainerLname = currentTrainer.lastname;
    //const trainerName = trainerFname + trainerLname;
    logger.debug('trainer id', request)
    const newBooking =
        {
          bookingId: uuid(),
          trainerName: request.body.trainerName,
          userFullName: userFullName,
          userId: userId,
          trainerId: request.body.trainerId,
          date: request.body.date,
          time: request.body.time,

        };

    logger.debug('New Booking', newBooking);
    userStore.addBooking(userId, newBooking);

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
    bookingToUpdate.date = date;
    bookingToUpdate.time = time;
    userStore.save();
    response.redirect('/membersbookings/');
  }




};

module.exports = membersbookings;