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
const dateformat = require('dateformat');

const membersclasses = {
  index(request, response) {
    logger.info('membersclasses rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const userId = loggedInUser.id;
    let searchedClasses;
    const searchClass = request.body.className;
    const trainerId = request.body.trainerId;
    const trainer = trainerStore.getTrainerById(trainerId);
    //if (searchClass == 'none' && trainer == 'none') {
    searchedClasses = classStore.getAllClasses();
    //} else {
    //  searchedClasses = classStore.searchClasses(searchClass, trainerId);
    //}
    //const searchedClasses = classStore.getAllClasses();//need to make this a saerch function, not just get all classes!!

    const classId = request.params.classId; //const lessonList = classStore.getClassById(classId).lessons;
    const trainerClassId = searchedClasses.trainerId;
    //const trainer = trainerStore.getTrainerById(trainerId);
    const lessonId = request.params.lessonId; //const statusOfLesson = searches.statusOfLesson(lessonList, userId);

    let i = 0;

    while (i < searchedClasses.length) {
      searchedClasses[i].numberAttended = 0;
      classStore.store.save();
      searchedClasses[i].lessons.forEach(function (lesson) {
            lesson.userIsAttending = 'red minus';
            searchedClasses[i].classAttend = 'none';//not sure if about fully attending that lesson, or ifuser is attending whole class
            classStore.store.save();

            let j = 0;
            while (j < lesson.attending.length) {
              if (lesson.attending[j] === userId) {
                lesson.userIsAttending = 'green check';
                searchedClasses[i].numberAttended = Number(searchedClasses[i].numberAttended) + 1;
                classStore.store.save();
              }

              j++;
            }

          }
      );
      if (searchedClasses[i].numberAttended = 0) {
        searchedClasses[i].classAttended = 'none';
        classStore.store.save();
      } else if ((searchedClasses[i].numberAttended >= 0) && (searchedClasses[i].numberAttended < searchedClasses[i].lessons.length)) {
        searchedClasses[i].classAttended = 'partial';
        classStore.store.save();
      } else if (searchedClasses[i].numberAttended === searchedClasses[i].lessons.length) {
        searchedClasses[i].classAttended = 'all';
        classStore.store.save();
      } else {
        searchedClasses[i].classAttended = 'indeterminate';
        classStore.store.save();
      }

      i++;
    }

    const viewData = {
      title: 'Gym App Member Schedule Classes',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      searchedClasses: searchedClasses,
      trainer: trainer, //statusOfLesson: statusOfLesson,
    };
    logger.info('about to render', classId);
    response.render('membersclasses', viewData);
  },

  updateSearch(request, response)
  {
    logger.info('rendering search update');
    const loggedInUser = accounts.getCurrentUser(request);
    const allClasses = classStore.getAllClasses(); //problem.Need the update terms to be any different from the index of this page.
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
    } else
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
      if (attendingLesson.attending[i] === currentUser.id)
      {
        //_.pull(attendList, userId);

        attendingLesson.currentCapacity -= 1;
        attendingLesson.attending.splice(attendingLesson.attending[i], 1);
        classStore.store.save();
      } else
      {
        logger.debug('You were not enrolled in the first place.');
      }
    }

    response.redirect('/membersclasses');
  },

  classAttend(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const attendingClass = classStore.getClassById(classId); //const attendingLesson = classStore.getLesson(classId, lessonId);
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
      } else
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
    const attendingClass = classStore.getClassById(classId); //const attendingLesson = classStore.getLesson(classId, lessonId);
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
        } else {
          logger.debug('You were not enrolled in the first place.');
        }
      }

    }

    response.redirect('/membersclasses');
  },

};

module.exports = membersclasses;
