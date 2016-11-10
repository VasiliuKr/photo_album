'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs'),
  crypto=require('crypto'),
  ObjectId = require('mongodb').ObjectID;//,
//albumModel=require('./albumModel');

let  add = function(id,user,text) {
  let userId=user;
  let photoId=ObjectId(id);
  let comment={
    comment :text,
    user: user,
    date: (new Date).getTime()
  };
  let albumid;
  return  new Promise(function(resolve, reject) {
    let Album = mongoose.model('album');
    Album.where("photos._id").eq(photoId).then(u => {
      albumid = u[0]._id;
      var photoArray = [];
      photoId=photoId.toString();
      u[0].photos.map(photo=> {
        if (photo._id == photoId){
          photo.comments.push(comment);
        }
        photoArray.push(photo);
      });

      return Album.findOneAndUpdate({_id:albumid},{photos:photoArray},{upsert:true});
    }).then( u => {
      resolve(u);
    }, err => {
      resolve({error: err.error || 'Неизвестная ошибка'});
    })
  })
};

let get = function(id) {
  let photoId = ObjectId(id);
  return  new Promise(function(resolve, reject) {
    let Album = mongoose.model('album');
    Album.where("photos._id").eq(photoId).then(u => {
      photoId = photoId.toString();
      u[0].photos.map(photo=> {
        if (photo._id == photoId) {
          resolve(photo.comments);
          return;
        }
      });
      resolve({error:'Фото не найденно.'});
      return;
    })
  })
};

module.exports = {
  get: get,
  add: add
};
