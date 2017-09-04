/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const fitnessStore = require('../models/fitness-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const fitnesscreation = {
  index(request, response) {
    logger.info('fitnesscreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(user);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(user);

    const viewData = {
      title: 'Gym App Trainer Creating Fitness Programmes',
      id: userId,
      user: user,
      trainerId: trainerId,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,

    };
    logger.info('about to render');
    response.render('fitnesscreation', viewData);
  },

  addFitnessProg(request, response)
  {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const userName = user.firstname;
    const programId = uuid();
    const programName = request.body.programName;
    const newProgram =
        {
          programId: programId,
          programName: programName,
          trainerId: trainerId,
          userId: userId,
          userName: userName,
          sessions: [],
        };
    const session1 =
        {
          sessionId: uuid(),
          sessionType: request.body.sessionType1,
          sessionName: '',
          classId: '',
          description: '',

        };
    newProgram.sessions.push(session1);

    const session2 =
        {
          sessionId: uuid(),
          sessionType: request.body.sessionType2,
          sessionName: '',
          classId: '',
          description: '',

        };
    newProgram.sessions.push(session2);

    const session3 =
        {
          sessionId: uuid(),
          sessionType: request.body.sessionType3,
          sessionName: '',
          classId: '',
          description: '',

        };
    newProgram.sessions.push(session3);

    const session4 =
        {
          sessionId: uuid(),
          sessionType: request.body.sessionType4,
          sessionName: '',
          classId: '',
          description: '',

        };
    newProgram.sessions.push(session4);

    const session5 =
        {
          sessionId: uuid(),
          sessionType: request.body.sessionType5,
          sessionName: '',
          classId: '',
          description: '',

        };
    newProgram.sessions.push(session5);

    logger.debug('New Program', newProgram);
    fitnessStore.addProgram(newProgram);
    response.redirect('/fitnesscreation/' + userId + '/fitnessprogdetails/' + programId);
  },

  fitnessprogdetails(request, response)
  {
    logger.info('detailFitnessProg rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainersId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(user);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(user); //const userBookings = userStore.getAllUserBookings(userId);
    const programId = request.params.programId;
    const viewData = {
      title: 'Gym App Trainer Viewing User',
      id: userId,
      user: user,
      trainersId: trainersId,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,
      programId: programId,

    };
    logger.debug(`View ${user.firstname}'s fitness program`);

    response.render('fitnessprogdetails', viewData);
  },

  fitnessProg(request, response)
  {
    const userId = request.params.id;
    const programId = request.params.programId;
    const programName = request.body.programName;
    const programToUpdate = fitnessStore.getProgramById(programId);
    programToUpdate.programName = programName;
    fitnessStore.save();
    response.redirect('/fitnesscreation/' + userId);
  },

};

module.exports = fitnesscreation;
