/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const fitnessStore = require('../models/fitness-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

const fitnesscreation = {
  index(request, response) {
    logger.info('fitnesscreation rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const userId = request.params.id;
    const user = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(user);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(user);
    const fitnessArray = fitnessStore.getAllPrograms();
    for (let i = 0; i < fitnessArray.length; i++)
    {
      fitnessArray[i].trainersProgram = false;

      if (trainerId === fitnessArray[i].trainerId)
      {
        fitnessArray[i].trainersProgram = true;
      }

      fitnessStore.save();
    }

    const sessions = fitnessArray.sessions;

    const viewData = {
      title: 'Gym App Trainer Creating Fitness Programmes',
      id: userId,
      user: user,
      trainerId: trainerId,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,
      fitnessArray: fitnessArray,
      sessions: sessions,

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
    const custom = false;
    const predefined = false;
    const isClass = false;
    const newProgram =
        {
          programId: programId,
          programName: programName,
          trainersProgram: '',
          trainerId: trainerId,
          userId: userId,
          userName: userName,
          sessions: [],
        };
    const session1 =
        {
          sessionId: 1,
          sessionType: request.body.sessionType1,
          custom: custom,
          predefined: predefined,
          isClass: isClass,
          classId: '',
          sessionName: '',
          description: '',

        };
    newProgram.sessions.push(session1);

    const session2 =
        {
          sessionId: 2,
          sessionType: request.body.sessionType2,
          custom: custom,
          predefined: predefined,
          isClass: isClass,
          classId: '',
          sessionName: '',
          description: '',

        };
    newProgram.sessions.push(session2);

    const session3 =
        {
          sessionId: 3,
          sessionType: request.body.sessionType3,
          custom: custom,
          predefined: predefined,
          isClass: isClass,
          classId: '',
          sessionName: '',
          description: '',

        };
    newProgram.sessions.push(session3);

    const session4 =
        {
          sessionId: 4,
          sessionType: request.body.sessionType4,
          custom: custom,
          predefined: predefined,
          isClass: isClass,
          classId: '',
          sessionName: '',
          description: '',

        };
    newProgram.sessions.push(session4);

    const session5 =
        {
          sessionId: 5,
          sessionType: request.body.sessionType5,
          custom: custom,
          predefined: predefined,
          isClass: isClass,
          classId: '',
          sessionName: '',
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
    const sessionsList = fitnessStore.getAllProgramSessions(programId);
    const classList = classStore.getAllClasses();

    for (let i = 0; i < 5; i++)
    {
      if (sessionsList[i].sessionType === 'custom')
    {
        sessionsList[i].custom = true;
        fitnessStore.save();
      }

      if (sessionsList[i].sessionType === 'predefined')
      {
        sessionsList[i].predefined = true;
        fitnessStore.save();
      }

      if (sessionsList[i].sessionType === 'class')
      {
        sessionsList[i].isClass = true;
        fitnessStore.save();
      }
    }

    /*const fitnessArray = fitnessStore.getAllPrograms();
    for (let i = 0; i < fitnessArray.length; i++)
    {
      fitnessArray[i].trainersProgram = false;

      if (trainerId === fitnessArray[i].trainerId)
      {
        fitnessArray[i].trainersProgram = true;
      }

      fitnessStore.save();
    }*/

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
      sessionsList: sessionsList,
      classList: classList,

    };
    logger.debug(`View ${user.firstname}'s fitness program`);

    response.render('fitnessprogdetails', viewData);
  },

  updateFitnessProg(request, response)
  {
    const userId = request.params.id;
    const programId = request.params.programId;
    const programName = request.body.programName;
    const programToUpdate = fitnessStore.getProgramById(programId);
    const sessions = programToUpdate.sessions;
    const session1 = programToUpdate.sessions[0];
    const session2 = programToUpdate.sessions[1];
    const session3 = programToUpdate.sessions[2];
    const session4 = programToUpdate.sessions[3];
    const session5 = programToUpdate.sessions[4];

    if (request.body.classId1 != null) {

      session1.classId = request.body.classId1;
      let fitnessClass = classStore.getClassById(session1.classId);
      session1.sessionName = fitnessClass.className;
    } else
    {
      session1.sessionName = request.body.sessionName1;
    }

    if (request.body.classId2 != null) {

      session2.classId = request.body.classId2;
      let fitnessClass = classStore.getClassById(session2.classId);
      session2.sessionName = fitnessClass.className;
    } else
    {
      session2.sessionName = request.body.sessionName2;
    }

    if (request.body.classId3 != null) {

      session3.classId = request.body.classId3;
      let fitnessClass = classStore.getClassById(session3.classId);
      session3.sessionName = fitnessClass.className;
    } else
    {
      session3.sessionName = request.body.sessionName3;
    }

    if (request.body.classId4 != null) {

      session4.classId = request.body.classId4;
      let fitnessClass = classStore.getClassById(session4.classId);
      session4.sessionName = fitnessClass.className;
    } else
    {
      session4.sessionName = request.body.sessionName4;
    }

    if (request.body.classId5 != null) {

      session5.classId = request.body.classId5;
      let fitnessClass = classStore.getClassById(session5.classId);
      session5.sessionName = fitnessClass.className;
    } else
    {
      session5.sessionName = request.body.sessionName5;
    }

    for (let i = 0; i < 5; i++)
    {
      if (sessions[i].sessionType === 'predefined') {
        if (sessions[i].sessionName === 'cardio') {
          sessions[i].description = 'Cardio workouts are good for the cardigan';
        } else if (sessions[i].sessionName === 'extreme') {
          sessions[i].description = 'Xtream workouts for Xtream people';
        } else if (sessions[i].sessionName === 'jazz') {
          sessions[i].description = 'Exercise to Jazzercise videos';
        }
      }
    }

    fitnessStore.save(); //Currently predefined session descriptions do not work!!!!!!!!!!!!!!!!!!!!!!!!!

    response.redirect('/fitnesscreation/' + userId);
  },

  deleteFitnessProg(request, response)
  {
    const programId = request.params.programId;
    const userId = request.params.id;
    logger.debug(`deleting ${programId}`);
    fitnessStore.deleteProgram(programId);
    response.redirect('/fitnesscreation/' + userId);
  },

};

module.exports = fitnesscreation;
