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

  getAllMembers() {
    return this.store.findBy(this.collection, { trainer: false });
  },

  getAllTrainers() {
    return this.store.findBy(this.collection, { trainer: true });
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

//getMemberByEmail(email) {
//  return this.store.findOneBy(this.collection, { email: email });
//},

//getTrainerByEmail(email) {
//  return this.store.findOneBy(this.collection, { email: email });
//},

  getAssessment(id)
  {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserAssessments(userid)
  {
    return this.store.findBy(this.collection, { userid: userid });
  },

  addAssessment(id, assessment) {
    const user = this.getUserById(id);
    user.assessments.unshift(assessment);
    //this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessment(id, assessmentId)
  {
    const user = this.getUserById(id);
    _.remove(user.assessments, { assessmentId: assessmentId });
    //const assessment = this.getAssessment(id);
    //this.store.remove(this.collection, assessment);
    this.store.save();
  },

};

module.exports = userStore;