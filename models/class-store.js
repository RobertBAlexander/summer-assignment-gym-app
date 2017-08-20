/**
 * Created by Robert Alexander on 15/08/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const classStore = {
  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

getAllClasses() {
  return this.store.findAll(this.collection);
},

addClass(newClass) {
  this.store.add(this.collection, newClass);
  this.store.save();
},

getClassById(classId){
  return this.store.findOneBy(this.collection, { classId: classId });
},

getLesson(classId, lessonId){
  const currentClass = this.getClassById(classId);
  for (let i = 0; i < currentClass.lessons.length; i++)
  {
    if (currentClass.lessons[i].lessonId === lessonId)
    {
      return currentClass.lessons[i];
    }
  }
},

  //getClassLessons probably does nothing!
getClassLessons(classId)
{
  return this.store.findBy(this.collection, { classId: classId });
},

deleteClass(classId)
{
  const currentClass = this.getClassById(classId);
  this.store.remove(this.collection, currentClass);
  this.store.save();
},

deleteLesson(classId, lessonId)
{
  const currentClass = this.getClassById(classId);
  _.remove(currentClass.lessons, { lessonId: lessonId });
  this.store.save();
},


  save() {
    this.store.save(); //Method used by controllers which saves the JSON object after they have altered data
  },

};

module.exports = classStore;