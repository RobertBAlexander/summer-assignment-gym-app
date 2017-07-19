/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';
const userStore = require('../models/user-store');
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
    userStore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/login');
  },

  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('user', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.user;
    return userStore.getUserByEmail(userEmail);
  },


};

module.exports = accounts;