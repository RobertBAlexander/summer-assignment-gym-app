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

  //does this even work?
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

  getAllUserBookings(userId)
  {
    const user = this.getUserById(userId);
    return user.bookings;
  },

  getBookingById(userId, bookingId)
  {
    const user = this.getUserById(userId);
    for (let i = 0; i < user.bookings.length; i++)
    {
      if (user.bookings[i].bookingId === bookingId)
      {
        return user.bookings[i];
      }
    }
  },

  //does this even work? This is above, and working. So why is it here?
  getUserBookings(userId)
  {
    return this.store.findBy(this.collection, { userId: userId });
  },

  addBooking(userId, booking)
  {
    const user = this.getUserById(userId);
    user.bookings.push(booking);
    this.save();
  },

  deleteBooking(userId, bookingId)
  {
    const user = this.getUserById(userId);
    _.remove(user.bookings, { bookingId: bookingId });
    this.store.save();
  },

  getAllUserGoals(userId)
  {
    const user = this.getUserById(userId);
    return user.goals;
  },

  getGoalById(userId, goalId)
  {
    const user = this.getUserById(userId);
    for (let i = 0; i < user.goals.length; i++)
    {
      if (user.goals[i].goalId === goalId)
      {
        return user.goals[i];
      }
    }
  },

  addGoal(userId, goal)
  {
    const user = this.getUserById(userId);
    user.bookings.push(goal);
    this.save();
  },

  deleteGoal(userId, goalId)
  {
    const user = this.getUserById(userId);
    _.remove(user.goals, { goalId: goalId });
    this.store.save();
  },



  deleteUser(id)
  {
    const user = this.getUserById(id);
    this.store.remove(this.collection, user);
    this.store.save();
  },

  save() {
    this.store.save(); //Method used by controllers which saves the JSON object after they have altered data
  },

};

module.exports = userStore;