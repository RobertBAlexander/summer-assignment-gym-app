/**
 * Created by Robert Alexander on 03/09/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const fitnessStore = {
  store: new JsonStore('./models/fitness-store.json', { programs: [] }),
  collection: 'programs',

  getAllPrograms() {
    return this.store.findAll(this.collection);
  },

  addProgram(newProgram) {
    this.store.add(this.collection, newProgram);
    this.store.save();
  },

  getProgramById(programId) {
    return this.store.findOneBy(this.collection, { programId: programId });
  },

  getSession(programId, sessionId) {
    const currentProgram = this.getProgramById(programId);
    for (let i = 0; i < currentProgram.sessions.length; i++)
    {
      if (currentProgram.sessions[i].sessionId === sessionId)
      {
        return currentProgram.sessions[i];
      }
    }
  },

  //getClassLessons probably does nothing!
  getProgramSessions(programId)
  {
    return this.store.findBy(this.collection, { programId: programId });
  },

  deleteProgram(programId)
  {
    const currentProgram = this.getProgramById(programId);
    this.store.remove(this.collection, currentProgram);
    this.store.save();
  },

  deleteSession(programId, sessionId)
  {
    const currentProgram = this.getProgramById(programId);
    _.remove(currentProgram.sessions, { sessionId: sessionId });
    this.store.save();
  },

  save() {
    this.store.save(); //Method used by controllers which saves the JSON object after they have altered data
  },

};

module.exports = fitnessStore;
