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


    for (let j = 0; j < listBookings; j++)
    {
      let trainerId = listBookings[j].trainerId;
      let bookedTrainer = trainerStore.getTrainerById(trainerId);
      let trainerName = bookedTrainer.firstname;
      return trainerName;

      //for (let i = 0; i < trainerStore.trainers.length; i++)
      //{
      //  if (trainerStore.trainers[i].id === listBookings[j].trainerId)
      //  {
      //    let trainer = trainerStore.getTrainerById(listBookings[j].trainerId);
      //    let trainerName = trainer.firstname;
      //    return trainerName;
      //  }
      //}
    }

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
      //trainer: trainer,

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
    const newBooking =
        {
          bookingId: uuid(),
          trainerId: request.body.trainer,
          userId: userId,
          date: request.body.date,
          time: request.body.time,

        };

    logger.debug('New Booking', newBooking);
    userStore.addBooking(userId, newBooking);


    response.redirect('/membersbookings/');
  },

  //addBooking(request, response)
  //{
  //  const loggedInUser
 // }


/*
  updateSearch(request, response)
  {
    logger.info('rendering search update');
    const loggedInUser = accounts.getCurrentUser(request);
    const allClasses = classStore.getAllClasses();
    //problem here is we need the update terms for this to be any different from the index of this page.
  },

  lessonAttend(request, response) {

    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const attendingLesson = classStore.getLesson(classId, lessonId);
    const currentUser = accounts.getCurrentUser(request);
    const userId = currentUser.id;
    const attendList = attendingLesson.attending;
    let alreadyAttending = false;

    for (let i = 0; i < attendList.length; i++)
    {
      if (attendingLesson.attending[i] === currentUser.id)
      {
        alreadyAttending = true;
      }
    }
    if ((!alreadyAttending) && (attendingLesson.currentCapacity < attendingLesson.maxCapacity))
    {
      logger.info('rendering attendance of member to lesson');
      attendingLesson.currentCapacity = attendingLesson.currentCapacity + 1;
      attendList.push(userId);
      classStore.store.save();
    }
    else
    {
      logger.debug('You can only attend once.');
    }

    response.redirect('/membersclasses');
  },

  leaveLesson(request, response)
  {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const attendingLesson = classStore.getLesson(classId, lessonId);
    const currentUser = accounts.getCurrentUser(request);
    const userId = currentUser.id;
    const attendList = attendingLesson.attending;

    for (let i = 0; i < attendList.length; i++)
    {
      if(attendingLesson.attending[i] === currentUser.id)
      {
        //_.pull(attendList, userId);

        attendingLesson.currentCapacity -= 1;
        attendingLesson.attending.splice(attendingLesson.attending[i], 1);
        classStore.store.save();
      }
      else
      {
        logger.debug('You were not enrolled in the first place.');
      }
    }
    response.redirect('/membersclasses');
  },

  classAttend(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const attendingClass = classStore.getClassById(classId);
    //const attendingLesson = classStore.getLesson(classId, lessonId);
    const currentUser = accounts.getCurrentUser(request);
    const userId = currentUser.id;

    for (let j = 0; j < attendingClass.lessons.length; j++)
    {
      let lesson = attendingClass.lessons[j];
      let attendList = lesson.attending;
      let alreadyAttending = false;

      for (let i = 0; i < lesson.attending.length; i++)
      {
        if (lesson.attending[i] === currentUser.id)
        {
          alreadyAttending = true;
        }
      }
      if ((!alreadyAttending) && (lesson.currentCapacity < lesson.maxCapacity))
      {
        logger.info('rendering attendance of member to lesson');
        lesson.currentCapacity = lesson.currentCapacity + 1;
        attendList.push(userId);
        classStore.store.save();
      }
      else
      {
        logger.debug('You can only attend once.');
      }


    }
    response.redirect('/membersclasses');
  },

  leaveClass(request, response)
  {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const attendingClass = classStore.getClassById(classId);
    //const attendingLesson = classStore.getLesson(classId, lessonId);
    const currentUser = accounts.getCurrentUser(request);
    const userId = currentUser.id;

    for (let j = 0; j < attendingClass.lessons.length; j++) {
      let lesson = attendingClass.lessons[j];
      let attendList = lesson.attending;
      let alreadyAttending = false;

      for (let i = 0; i < lesson.attending.length; i++) {
        if (lesson.attending[i] === currentUser.id) {
          //_.pull(attendList, userId);

          lesson.currentCapacity -= 1;
          lesson.attending.splice(lesson.attending[i], 1);
          classStore.store.save();
        }
        else {
          logger.debug('You were not enrolled in the first place.');
        }
      }

    }
    response.redirect('/membersclasses');
  },

*/
};

module.exports = membersbookings;