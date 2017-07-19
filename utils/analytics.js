/**
 * Created by Robert Alexander on 13/07/2017.
 */
'use strict';

//const accounts = require('../controllers/accounts');

const analytics = {


  calculateBMI(user)
  {
    if (user.height <= 0)
    {
      return 0;
    }
    else
    {
      return (user.startingWeight / (user.height * user.height)).toFixed(2);
    }

  },

  determineBMICategory(calculateBMI)
  {
    if (calculateBMI < 15)
    {
      return "\"VERY SEVERELY UNDERWEIGHT\"";
    }
    else if (calculateBMI < 16)
    {
      return "\"SEVERELY UNDERWEIGHT\"";
    }
    else if (calculateBMI < 18.5)
    {
      return "\"UNDERWEIGHT\"";
    }
    else if (calculateBMI < 25)
    {
      return "\"NORMAL\"";
    }
    else if (calculateBMI < 30)
    {
      return "\"OVERWEIGHT\"";
    }
    else if (calculateBMI < 35)
    {
      return "\"MODERATELY OBESE\"";
    }
    else if (calculateBMI < 40)
    {
      return "\"SEVERELY OBESE\"";
    }
    else return "\"VERY SEVERELY OBESE\"";
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

  isIdealBodyWeight(gender, height, weight)
  {
    const fiveFeet = 60.0;
    let idealBodyWeight = 0;
    let inches = this.convertHeightMetersToInches(height);

    if (inches <= fiveFeet)
    {
      if (gender === "M")
      {
        idealBodyWeight = 50;
      }
      else
      {
        idealBodyWeight = 45.5;
      }
    }
    else
    {
      if (gender === "M")
      {
        idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
      }
      else
      {
        idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
      }
    }
    if ( (idealBodyWeight <= weight + 2.0) && (idealBodyWeight >= weight - 2.0))
    {
      return "green";
    }
    else
    {
      return "red";
    }

  }

}

module.exports = analytics;