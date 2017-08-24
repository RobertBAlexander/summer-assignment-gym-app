/**
 * Created by Robert Alexander on 20/08/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const searches = require('../utils/searches.js');
const classStore = require('../models/class-store.js');

const membersclasses = {
  index(request, response) {
    logger.info('membersclasses rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const searchedClasses = classStore.getAllClasses();
    const trainerClassId = searchedClasses.trainerId;
    const trainer = trainerStore.getTrainerById(trainerClassId);
    //const trainerName = trainer.firstname;

    //const classTrainerId =
    const viewData = {
      title: 'Gym App Member Schedule Classes',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      searchedClasses: searchedClasses,
      trainer: trainer,
      //trainerName: trainerName,
    };
    logger.info('about to render');
    response.render('membersclasses', viewData);
  },

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

  /*
  updatefname(request, response)
  {
    logger.info('rendering update of first name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.firstname = request.body.firstname;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatelname(request, response)
  {
    logger.info('rendering update of last name');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.lastname = request.body.lastname;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateemail(request, response)
  {
    logger.info('rendering update of email');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.email = request.body.email;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatepicture(request, response)
  {
    logger.info('rendering update of profile picture');
    const loggedInUser = accounts.getCurrentUser(request);
    pictureStore.addPicture(loggedInUser.id, request.body.title, request.files.picture, function () {
      response.redirect('/memberprofile');
    });

  },

  updategender(request, response)
  {
    logger.info('rendering update of gender');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.gender = request.body.gender;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updateheight(request, response)
  {
    logger.info('rendering update of height');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.height = request.body.height;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

  updatestartingweight(request, response)
  {
    logger.info('rendering update of starting weight');
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.startingWeight = request.body.startingWeight;

    userStore.store.save();
    response.redirect('/memberprofile');
  },

*/

};

module.exports = membersclasses;