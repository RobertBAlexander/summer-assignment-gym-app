/**
 * Created by Robert Alexander on 07/09/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const searches = require('../utils/searches.js');
const fitnessStore = require('../models/fitness-store.js');
const classStore = require('../models/class-store.js');
const dateformat = require('dateformat');

const memberfitness = {
  index(request, response) {
    logger.info('memberfitness rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const userId = loggedInUser.id;
    const fitnessArray = fitnessStore.getProgramByUser(userId);
    const sessions = fitnessArray.sessions;
    const trainerId = request.body.trainerId;
    const trainer = trainerStore.getTrainerById(trainerId);

    const classId = request.params.classId;
    const viewData = {
      title: 'Gym App Member Schedule Classes',
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      trainer: trainer,
      fitnessArray: fitnessArray,
      sessions: sessions,
    };
    logger.info('about to render', classId);
    response.render('memberfitness', viewData);
  },

  classAttend(request, response) {
    const classId = request.params.classId;
    const attendingClass = classStore.getClassById(classId);
    const currentUser = accounts.getCurrentUser(request);
    const userId = currentUser.id;
    logger.debug('class', classId);

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

    response.redirect('/memberfitness');
  },

};

module.exports = memberfitness;
