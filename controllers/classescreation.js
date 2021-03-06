/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store.js');
const classStore = require('../models/class-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

const classescreation = {
  index(request, response) {
    logger.info('classescreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classesList = classStore.getAllClasses();

    const viewData = {
      title: 'Gym App Trainer Creating Scheduled Classes',

      trainer: loggedInTrainer,
      classesList: classesList,

    };
    logger.info('about to render');
    response.render('classescreation', viewData);
  },

  addClass(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const startDate = request.body.startDate;
    const newClass =
        {
          classId: uuid(),
          className: request.body.className,
          trainerId: loggedInTrainer.trainerId,
          lessonNumber: request.body.lessonNumber,
          startDate: dateformat(startDate, 'ddd, dd mmm yyyy'),
          maxCapacity: request.body.capacity,
          difficulty: request.body.difficulty,
          classAttend: 'none',
          numberAttended: 0,
          lessons: [],
        };
    for (let i = 0; i < request.body.lessonNumber; i++) {
      const startDate = new Date(request.body.startDate);
      const daysToAdd = (i * 7);
      const lessonDate = new Date(startDate.setTime(startDate.getTime() + (daysToAdd * 86400000)));//7*24*60*60 is one week of sseconds
      let userIsAttending = false;
      const lesson =
          {
            lessonId: uuid(),

            lessonDate: dateformat(lessonDate, 'ddd, dd mmm yyyy'),
            startTime: request.body.startTime,
            duration: request.body.duration,
            currentCapacity: 0,
            maxCapacity: request.body.capacity,
            userIsAttending: userIsAttending,
            attending: [],
          };
      newClass.lessons.push(lesson);
    }

    logger.debug('New Class', newClass);
    classStore.addClass(newClass);
    response.redirect('/classescreation/');

  },

  //addLesson

  deleteClass(request, response)
  {
    const classId = request.params.classId;
    logger.debug(`deleting ${classId}`);
    classStore.deleteClass(classId);
    response.redirect('/classescreation/');
  },

  deleteLesson(request, response)
  {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    classStore.deleteLesson(classId, lessonId);
    const currentClass = classStore.getClassById(classId);
    currentClass.lessonNumber = (currentClass.lessonNumber - 1);

    response.redirect('/classescreation/');
  },

  updateClassName(request, response) {
    const classId = request.params.classId;
    const className = request.body.className;
    const classToUpdate = classStore.getClassById(classId);
    classToUpdate.className = className;
    classStore.save();
    response.redirect('/classescreation/');
  },

  //currently not working for maxCapacity in lessons in part becase of .getClassLessons. Need a better way to iterate through loop.
  updateClassCapacity(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const maxCapacity = request.body.maxCapacity;
    const classToUpdate = classStore.getClassById(classId);
    const lessonsList = classStore.getClassLessons(classId);

    classToUpdate.maxCapacity = maxCapacity;
    for (let i = 0; i < lessonsList.length; i++) {
      const lesson = lessonsList[i];
      lesson.maxCapacity = maxCapacity;
    }

    classStore.save();
    response.redirect('/classescreation/');
  },

  updateClassDifficulty(request, response) {
    const classId = request.params.classId;
    const difficulty = request.body.difficulty;
    const classToUpdate = classStore.getClassById(classId);
    classToUpdate.difficulty = difficulty;
    classStore.save();
    response.redirect('/classescreation/');
  },

  updateLessonDate(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const lessonDate = request.body.lessonDate;
    const lessonToUpdate = classStore.getLesson(classId, lessonId);
    lessonToUpdate.lessonDate = dateformat(lessonDate, 'ddd, dd mmm yyyy');
    classStore.save();
    response.redirect('/classescreation/');
  },

  updateLessonStart(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const startTime = request.body.startTime;
    const lessonToUpdate = classStore.getLesson(classId, lessonId);
    lessonToUpdate.startTime = startTime;
    classStore.save();
    response.redirect('/classescreation/');
  },

  updateDuration(request, response) {
    const classId = request.params.classId;
    const lessonId = request.params.lessonId;
    const duration = request.body.duration;
    const lessonToUpdate = classStore.getLesson(classId, lessonId);
    lessonToUpdate.duration = duration;
    classStore.save();
    response.redirect('/classescreation/');
  },

};

module.exports = classescreation;
