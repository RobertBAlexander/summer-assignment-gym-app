'use strict';
/**
 * Created by Robert Alexander on 12/07/2017.
 */

const userStore = require('../models/user-store');
const trainerStore = require('../models/trainer-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('user', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Signup to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    user.assessments = [];
    user.bookings = [];
    user.goals = [];
    userStore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/login');
  },

  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    const alert = 'hello';
    if (user && user.password === request.body.password) {
      response.cookie('user', user.id);
      logger.info(`logging in ${user.id}`);
      response.redirect('/dashboard');
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie('trainer', trainer.trainerId);
      logger.info(`logging in ${trainer.trainerId}`);
      response.redirect('/trainerdashboard');
    } else {
      alert: alert,
          response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userId = request.cookies.user;
    return userStore.getUserById(userId);
  },

  getCurrentTrainer(request) {
    const trainerId = request.cookies.trainer;
    return trainerStore.getTrainerById(trainerId);
  },

};

module.exports = accounts;
