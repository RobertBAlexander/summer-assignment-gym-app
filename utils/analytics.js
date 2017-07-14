/**
 * Created by Robert Alexander on 13/07/2017.
 */
'use strict';

const analytics = {

  calculateBMI (height, weight)
  {
    if (height <= 0)
    {
      return 0;
    }
    else
    {
      return (weight / (height * height)).toFixed(2);
    }

  },

  determineBMICategory(bmiValue)
  {
    if (bmiValue < 15)
    {
      return "\"VERY SEVERELY UNDERWEIGHT\"";
    }
    else if (bmiValue < 16)
    {
      return "\"SEVERELY UNDERWEIGHT\"";
    }
    else if (bmiValue < 18.5)
    {
      return "\"UNDERWEIGHT\"";
    }
    else if (bmiValue < 25)
    {
      return "\"NORMAL\"";
    }
    else if (bmiValue < 30)
    {
      return "\"OVERWEIGHT\"";
    }
    else if (bmiValue < 35)
    {
      return "\"MODERATELY OBESE\"";
    }
    else if (bmiValue < 40)
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
    return ( (idealBodyWeight <= weight + 2.0) && (idealBodyWeight >= weight - 2.0));
  }

}

module.exports = analytics;