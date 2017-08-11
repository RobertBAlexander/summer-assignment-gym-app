/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const trainerStore = require('../models/trainer-store');
const userStore = require('../models/user-store');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');

const viewmember = {
  index(request, response) {
    logger.info('viewmember rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const userId = request.params.id;
    const viewmember = userStore.getUserById(userId);
    const calculateBMI = analytics.calculateBMI(viewmember);
    const isIdealBodyWeight = analytics.isIdealBodyWeight(viewmember);
    const isTrainer = true;

    const viewData = {
      title: 'Gym App Trainer Viewing User',
      id: userId,
      user: viewmember,
      calculateBMI: calculateBMI,
      determineBMICategory: analytics.determineBMICategory(calculateBMI),
      idealBodyWeight: isIdealBodyWeight,
      trainer: loggedInTrainer,
      isTrainer: isTrainer,

    };
    logger.debug(`View ${viewmember.firstname} assessments`);
    //const list = viewmember.assessments;
    //for (let i = 0; i < list.length; i++) {
    //  list[i].updateComment = true;

    //}
    response.render('viewmember', viewData);
  },

  deleteAssessment(request, response) {
    const userId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const viewmember = userStore.getUserById(userId);
    userStore.deleteAssessment(userId, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId} for member ${userId}`);
    response.redirect('/viewmember');
  },

  updateComment(request, response) {
    const userId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const comment = request.body.comment;
    const assessmentToUpdate = userStore.getAssessment(userId, assessmentId);
    assessmentToUpdate.comment = comment;
    userStore.save();
    response.redirect('/trainerdashboard');
  },




};

module.exports = viewmember;