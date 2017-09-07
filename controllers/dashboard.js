/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger'); //const playlistStore = require('../models/playlist-store');
const userStore = require('../models/user-store.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const dateformat = require('dateformat');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const calculateBMI = analytics.calculateBMI(loggedInUser);
    const isTrainer = false; //am I actually using this anymore?
    const listGoals = loggedInUser.goals;
    let promptGoal = true;
    let promptAssessment = false;

    for (let i = 0; i < listGoals.length; i++) {
      logger.debug('in loop');
      if ((listGoals[i].goalStatus === 'open') || (listGoals[i].goalStatus === 'awaiting processing')) {
        promptGoal = false;
        const timeRemaining = (new Date(listGoals[i].date) - new Date);
        const daysTillGoalIsDue = ((((timeRemaining / 1000) / 60) / 60) / 24);
        logger.debug('days Till', daysTillGoalIsDue);
        if (daysTillGoalIsDue <= 0) {
          let gotWeight = false;
          let gotChest = false;
          let gotThigh = false;
          let gotUpperArm = false;
          let gotWaist = false;
          let gotHips = false;
          //const area = goalList[i].targetArea;
          //const target = goalList[i].targetGoal;
          if (loggedInUser.assessments.length > 0) {
            const latestAssessment = loggedInUser.assessments[0];
            const assessmentCheck = (new Date(latestAssessment.date) - new Date);
            const daysSinceLastAssessment = ((((assessmentCheck / 1000) / 60) / 60) / 24);
            logger.info(assessmentCheck);
            if ((daysSinceLastAssessment <= 0) && (daysSinceLastAssessment >= (-3))) {
              if ((listGoals[i].weight > latestAssessment.weight) && (listGoals[i].aboveorWeight = 'above')) {
                gotWeight = true;
              }

              if ((listGoals[i].weight < latestAssessment.weight) && (listGoals[i].aboveorWeight = 'below')) {

                gotWeight = true;
              }

              if ((listGoals[i].chest > latestAssessment.chest) && (listGoals[i].aboveorChest = 'above')) {
                gotChest = true;
              }

              if ((listGoals[i].chest < latestAssessment.chest) && (listGoals[i].aboveorChest = 'below')) {

                gotChest = true;
              }

              if ((listGoals[i].thigh > latestAssessment.thigh) && (listGoals[i].aboveorThigh = 'above')) {
                gotThigh = true;
              }

              if ((listGoals[i].thigh < latestAssessment.thigh) && (listGoals[i].aboveorThigh = 'below')) {

                gotThigh = true;
              }

              if ((listGoals[i].upperArm > latestAssessment.upperArm) && (listGoals[i].aboveorArm = 'above')) {
                gotWeight = true;
              }

              if ((listGoals[i].upperArm < latestAssessment.upperArm) && (listGoals[i].aboveorArm = 'below')) {

                gotUpperArm = true;
              }

              if ((listGoals[i].waist > latestAssessment.waist) && (listGoals[i].aboveorWaist = 'above')) {
                gotWaist = true;
              }

              if ((listGoals[i].waist < latestAssessment.waist) && (listGoals[i].aboveorWaist = 'below')) {

                gotWaist = true;
              }

              if ((listGoals[i].hips > latestAssessment.hips) && (listGoals[i].aboveorHips = 'above')) {
                gotHips = true;
              }

              if ((listGoals[i].hips < latestAssessment.hips) && (listGoals[i].aboveorHips = 'below')) {

                gotHips = true;
              }

              if ((gotWeight === true) && (gotChest === true) && (gotThigh === true)
                  && (gotUpperArm === true) && (gotWaist === true) && (gotHips === true)) {
                logger.debug('goal1', listGoals[i]);
                listGoals[i].goalStatus = 'achieved';
                userStore.save();
              } else {
                logger.debug('goal2', listGoals[i]);
                listGoals[i].goalStatus = 'missed';
                userStore.save();
              }
            } else {
              logger.debug('goal3', listGoals[i]);
              listGoals[i].goalStatus = 'awaiting processing';
              userStore.save();
              promptAssessment = true;
            }
          } else {
            logger.debug('goal4', listGoals[i]);
            listGoals[i].goalStatus = 'awaiting processing';
            userStore.save();
            promptAssessment = true;

          }
        } else
        {
          logger.debug('goal5', listGoals[i]);
          listGoals[i].goalStatus = 'open';
          userStore.save();
        }
      }
    }

    const viewData = {
      title: 'Users Gym App Dashboard', //user: userStore.getUserById(loggedInUser.id),
      user: loggedInUser,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: analytics.isIdealBodyWeight(loggedInUser),
      isTrainer: isTrainer, //profilepic: analytics.profilepic(loggedInUser), //playlists: playlistStore.getUserPlaylists(loggedInUser.id),
      promptGoal: promptGoal,
      promptAssessment: promptAssessment,
    };
    logger.info('about to render'); //, playlistStore.getAllPlaylists() --goes in above next to 'about to render'
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userId = loggedInUser.id; //const user = userStore.getUserById(userId);
    const date = new Date();
    const newAssessment =
        {
      assessmentId: uuid(), //userid: loggedInUser.id,
      date: dateformat(date, 'ddd, dd mmm yyyy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      trend: '',
      comment: '',

    };
    logger.debug('New Assessment', newAssessment);
    userStore.addAssessment(userId, newAssessment);
    analytics.trend(loggedInUser);
    response.redirect('/dashboard/');  //removed 'userId'
  },

  deleteAssessment(request, response)
  {
    const assessmentId = request.params.assessmentId;
    const loggedInUser = accounts.getCurrentUser(request);
    userStore.deleteAssessment(loggedInUser.id, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId}  for ${loggedInUser.firstname}`);
    analytics.trend(loggedInUser);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
