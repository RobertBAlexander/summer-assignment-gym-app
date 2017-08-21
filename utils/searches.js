/**
 * Created by Robert Alexander on 21/08/2017.
 */
'use strict';

const classStore = require('../models/class-store');
const userStore = require('../models/user-store');

const searches = {

  classesSearch()
  {
    const trainerFilter = 'any';//needs to be changed to checking the search request.params for trainer designation.
    const classList= classStore.classes;
    for (let i = 0; i < classList.length; i++)
    {
      let trainerTrue = 'true';
      if (trainerFilter == 'any' || trainerFilter == 'thisTrainer')
      {
        trainerTrue = 'true';
      }
      else
      {
        trainerTrue = 'false';
      }

      let nameTrue = 'true';
      if (classNameFilter == 'any' || classNameFilter == 'thisClassName')
      {
        nameTrue = 'true';
      }
      else
      {
        nameTrue = 'false';
      }

      if (trainerTrue == 'true' && nameTrue == 'true')
        return this.classId;

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


      if (i !== (assessmentList.length - 1)) {
        //previousAssessment = assessmentList[1];
        lastBMI = (previousAssessment.weight / (user.height * user.height));
      }
      else {
        //previousAssessment = user.startingWeight;
        lastBMI = (user.startingWeight / (user.height * user.height));

      }
      const idealBMI = 22;
      //const valueBMI = toTwoDecimalPlaces(previousAssessment / (getHeight() * getHeight()));


      const previousCompare = Math.abs(lastBMI -idealBMI);
      const currentCompare = Math.abs((currentAssessment.weight / (user.height * user.height)) -idealBMI);

      //below full code should work to allow the nochange icon to appear when the two assessments are exactly even
      //however this has not worked, and I have had to remvoe the no change icon due ot lack of funtionality
      if (currentCompare > previousCompare)
      {
        trend = "http://res.cloudinary.com/scealfada/image/upload/v1502489737/angry_pika_gydkr0.jpg";
      }
      else
      if (currentCompare < previousCompare)
      {
        trend = "http://res.cloudinary.com/scealfada/image/upload/v1502489737/happyhealth_pika_ny6rsz.png";
      }
      else
      {
        trend = "http://res.cloudinary.com/scealfada/image/upload/c_scale,w_49/v1502489737/nochange_xhsp47.jpg";
      }

      assessmentList[i].trend = trend;//when an assessment is created, this sends the trend information to it to give trend details.
      //IMPORTANT! This means that it still does not update trend details when the previous assessment is deleted.
    }
  },



};

module.exports = searches;