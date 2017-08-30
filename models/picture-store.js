/**
 * Created by Robert Alexander on 09/08/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store'); //const userStore = require('./user-store');
const cloudinary = require('cloudinary');
const path = require('path');
const logger = require('../utils/logger');

try {
  const env = require('../.env.json');
  cloudinary.config(env.cloudinary);
}
catch (e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const pictureStore = {

  store: new JsonStore('./models/picture-store.json', { pictures: [] }),
  collection: 'pictures',

  getAlbum(userid) {
    return this.store.findOneBy(this.collection, { userid: userid });
  },

  getPhotoByImg(userid, img)
  {
    const piccys = this.getAlbum(userid);
    for (let i = 0; i < piccys.photos.length; i++)
    {
      if (piccys.photos[i].img === img)
      {
        return piccys.photos[i];
      }
    }
  },

  addPicture(userId, title, imageFile, response) {
    let album = this.getAlbum(userId);
    if (!album) {
      album = {
        userid: userId,
        photos: [],
      }; //if there is no photos, do below, otherwise replace last image with this new image.
      this.store.add(this.collection, album);
      this.store.save();
    }

    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          const picture = {
            img: result.url,
            title: title,
          };
          album.photos.push(picture);
          this.store.save();
          response();
        });
      }
    });
  },

  deletePicture(userId, image) {
    const id = path.parse(image);
    let album = this.getAlbum(userId);
    _.remove(album.photos, { img: image });
    this.store.save();
    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });
  },

  deleteAllPictures(userId) {
    let album = this.getAlbum(userId);
    if (album) {
      album.photos.forEach(photo => {
        const id = path.parse(photo.img);
        cloudinary.api.delete_resources([id.name], result => {
          console.log(result);
        });
      });
      this.store.remove(this.collection, album);
      this.store.save();
    }
  },
};

module.exports = pictureStore;
