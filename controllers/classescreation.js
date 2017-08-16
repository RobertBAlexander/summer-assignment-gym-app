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
    const newClass =
        {
      classId: uuid(),
      className: request.body.className,
      trainerId: loggedInTrainer.id,
      lessonNumber: request.body.lessonNumber,
      startDate: request.body.startDate,
      maxCapacity: request.body.capacity,
      difficulty: request.body.difficulty,
      lessons: [],
    };
    for (let i = 0; i < request.body.lessonNumber; i++) {
      const startDate = new Date(request.body.startDate);
      const daysToAdd = (i * 7);
      const lessonDate = new Date(startDate.setTime(startDate.getTime() + (daysToAdd * 86400000)));
      const lesson =
          {
        lessonId: uuid(),
        lessonDate: lessonDate,
        startTime: request.body.startTime,
        duration: request.body.duration,
        currentCapacity: 0,
        maxCapacity: request.body.capacity,
        attending: [],
      };
      newClass.lessons.push(lesson);
      }
    logger.debug('New Class =', newClass);
    classStore.addClass(newClass);
    response.redirect('/classescreation/');

   },





};

module.exports = classescreation;