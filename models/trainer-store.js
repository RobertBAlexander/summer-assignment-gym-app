/**
 * Created by Robert Alexander on 20/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const analytics = require('../utils/analytics');

const trainerStore = {

  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },


  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  //Does this even work?
  getAssessment(id)
  {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerClasses(userid)
  {
    return this.store.findBy(this.collection, { userid: userid });
  },

  addClass(id, assessment) {
    const trainer = this.getTrainerById(id);
    trainer.classes.unshift(assessment);
    //this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeClass(id, assessmentId)
  {
    const trainer = this.getTrainerById(id);
    _.remove(trainer.classes, { classId: classId });
    //const assessment = this.getAssessment(id);
    //this.store.remove(this.collection, assessment);
    this.store.save();
  },

};

module.exports = trainerStore;