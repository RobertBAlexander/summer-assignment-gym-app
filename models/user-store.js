/**
 * Created by Robert Alexander on 12/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

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
};

module.exports = userStore;