/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const analytics = require('../utils/analytics');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },


  getAssessment(userId, assessmentId)
  {
    const user = this.getUserById(userId);
    for (let i = 0; i < user.assessments.length; i++)
    {
      if (user.assessments[i].assessmentId === assessmentId)
      {
        return user.assessments[i];
      }
    }
    //return this.store.findOneBy(this.collection, { id: id });
  },

  getUserAssessments(userId)
  {
    return this.store.findBy(this.collection, { userId: userId });
  },

  addAssessment(id, assessment) {
    const user = this.getUserById(id);
    user.assessments.unshift(assessment);
    //this.store.add(this.collection, assessment);
    this.store.save();
  },

  deleteAssessment(id, assessmentId) {
    const user = this.getUserById(id);
    _.remove(user.assessments, { assessmentId: assessmentId });
    this.store.save();
  },

};

module.exports = userStore;