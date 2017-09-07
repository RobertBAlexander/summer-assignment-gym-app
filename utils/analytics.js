/**
 * Created by Robert Alexander on 13/07/2017.
 */
'use strict';

const pictureStore = require('../models/picture-store');
const userStore = require('../models/user-store');
const logger = require('../utils/logger');
const dateformat = require('dateformat');
const analytics = {
  calculateBMI(user)
  {
    let memberWeight = 0;

    if (user.assessments.length > 0)
    {
      memberWeight = user.assessments[0].weight;
    } else
    {
      memberWeight = user.startingWeight;
    }

    if (user.height <= 0)
    {
      return 0;
    } else
    {
      return (memberWeight / (user.height * user.height)).toFixed(2);
    }
  },

  determineBMICategory(calculateBMI)
  {
    if (calculateBMI < 15)
    {
      return '"VERY SEVERELY UNDERWEIGHT"';
    } else if (calculateBMI < 16)
    {
      return '"SEVERELY UNDERWEIGHT"';
    } else if (calculateBMI < 18.5)
    {
      return '"UNDERWEIGHT"';
    } else if (calculateBMI < 25)
    {
      return '"NORMAL"';
    } else if (calculateBMI < 30)
    {
      return '"OVERWEIGHT"';
    } else if (calculateBMI < 35)
    {
      return '"MODERATELY OBESE"';
    } else if (calculateBMI < 40)
    {
      return '"SEVERELY OBESE"';
    } else return '"VERY SEVERELY OBESE"';
  },

  convertHeightMetersToInches(height)
  {
    let convertedHeight = (height * 39.37);
    return (convertedHeight.toFixed(2));
  },

  convertWeightKGtoPounds(weight)
  {
    let convertedWeight = (weight * 2.2);
    return (convertedWeight.toFixed(2));
  },

  isIdealBodyWeight(user)
  {
    const fiveFeet = 60.0;
    let idealBodyWeight = 0;
    let inches = this.convertHeightMetersToInches(user.height);
    let weight;
    const assessmentList = user.assessments;

    if (user.assessments.length >= 1) {
      weight = assessmentList[0].weight;
    } else
    {
      weight = user.startingWeight;
    }

    if (inches <= fiveFeet)
    {
      if (user.gender === 'male')
      {
        idealBodyWeight = 50;
      } else
      {
        idealBodyWeight = 45.5;
      }
    } else
    {
      if (user.gender === 'male')
      {
        idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
      } else
      {
        idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
      }
    }

    if ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight - 2.0)))
    {
      return 'green';
    } else
    {
      return 'red';
    }
  },

  trend(user)
  {
    let trend = 'happyhealth_pika.png';
    let assessmentList = user.assessments;
    let lastBMI;

    for (let i = 0; i < assessmentList.length; i++)
    {
      const previousAssessment = assessmentList[i + 1];
      const currentAssessment = assessmentList[i];

      if (i !== (assessmentList.length - 1)) { //previousAssessment = assessmentList[1];
        lastBMI = (previousAssessment.weight / (user.height * user.height));
      } else { //previousAssessment = user.startingWeight;
        lastBMI = (user.startingWeight / (user.height * user.height));
      }

      const idealBMI = 22;
      const previousCompare = Math.abs(lastBMI - idealBMI);
      const currentCompare = Math.abs((currentAssessment.weight / (user.height * user.height)) - idealBMI);
      if (currentCompare > previousCompare)
      {
        trend = 'http://res.cloudinary.com/scealfada/image/upload/v1502489737/angry_pika_gydkr0.jpg';
      } else
      if (currentCompare < previousCompare)
      {
        trend = 'http://res.cloudinary.com/scealfada/image/upload/v1502489737/happyhealth_pika_ny6rsz.png';
      } else
      {
        trend = 'http://res.cloudinary.com/scealfada/image/upload/c_scale,w_49/v1502489737/nochange_xhsp47.jpg';
      }

      assessmentList[i].trend = trend;//when an assessment is created, this sends the trend information to it to give trend details.
    }
  },

  profilepic(userid)
  {
    let profilepic = '<i class="ui yellow user icon"></i>';
    const piccys = pictureStore.getAlbum(userid);
    const photoList = piccys.photos;

    if (pic.photos.length = 0)
    {
      profilepic = '<i class="ui yellow user icon"></i>';
    } else
    {
      profilepic = '<img src="' + pictureStore.getPhotoById(userid, img) + 'style="width:50px height:50px border-radius:7px;">';
    }

    photoList[0].profilepic = profilepic;
  },

  statusOfGoal(user, goal)
  {
    logger.debug('user',  user.id);
    let today = new Date();
    let threeDays = today.setDate(today.getDate() - 3);
    const timeLeft = new Date(goal.date) - (dateformat(today, 'ddd, dd mmm yyyy'));//Calculates goal date
    const dueDate = timeLeft;
    let status = '';

    if ((new Date(goal.date) <= threeDays) || (new Date(goal.date) <= threeDays)) {//Checks if the goal is due

      // !!!This is not being read as a number!!

      let gotWeight = false;
      let gotChest = false;
      let gotThigh = false;
      let gotUpperArm = false;
      let gotWaist = false;
      let gotHips = false;//const area = goal.targetArea; //const target = goal.targetGoal;
      logger.debug('gotHips', gotHips);
      if (user.assessments.length > 0) {

        const latestAssessment = user.assessments[0];
        const assessmentCheck = (dateformat(today, 'ddd, dd mmm yyyy')) - (dateformat(latestAssessment.date, 'ddd, dd mmm yyyy'));
        logger.info(assessmentCheck);
        if ((assessmentCheck >= 0) && (assessmentCheck <= 3)) {//Will perform check if assessment was done recently

          if ((goal.weight > latestAssessment.weight) && (goal.aboveorWeight = 'above')) {
            gotWeight = true;
          }if ((goal.weight < latestAssessment.weight) && (goal.aboveorWeight = 'below')) {

            gotWeight = true;
          }

          if ((goal.chest > latestAssessment.chest) && (goal.aboveorChest = 'above')) {
            gotChest = true;
          }if ((goal.chest < latestAssessment.chest) && (goal.aboveorChest = 'below')) {

            gotChest = true;
          }

          if ((goal.thigh > latestAssessment.thigh) && (goal.aboveorThigh = 'above')) {
            gotThigh = true;
          }if ((goal.thigh < latestAssessment.thigh) && (goal.aboveorThigh = 'below')) {

            gotThigh = true;
          }

          if ((goal.upperArm > latestAssessment.upperArm) && (goal.aboveorArm = 'above')) {
            gotWeight = true;
          }if ((goal.upperArm < latestAssessment.upperArm) && (goal.aboveorArm = 'below')) {

            gotUpperArm = true;
          }

          if ((goal.waist > latestAssessment.waist) && (goal.aboveorWaist = 'above')) {
            gotWaist = true;
          }if ((goal.waist < latestAssessment.waist) && (goal.aboveorWaist = 'below')) {

            gotWaist = true;
          }

          if ((goal.hips > latestAssessment.hips) && (goal.aboveorHips = 'above')) {
            gotHips = true;
          }if ((goal.hips < latestAssessment.hips) && (goal.aboveorHips = 'below')) {

            gotHips = true;
          }

          if ((gotWeight === true) && (gotChest === true) && (gotThigh === true)
          && (gotUpperArm === true) && (gotWaist === true) && (gotHips === true)) {
            logger.debug('goal1',  goal);
            status = 'achieved';
          } else {
            logger.debug('goal2',  goal);
            status = 'missed';
          }

        } else {
          logger.debug('goal3',  goal);
          status = 'awaiting processing';
        }
      } else {
        logger.debug('goal4',  goal);
        status = 'awaiting processing';
      }
    }

    goal.goalStatus = status;
    logger.debug('goal5',  goal);
  },

};

module.exports = analytics;
