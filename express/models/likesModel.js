'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs'),
  crypto=require('crypto'),
  ObjectId = require('mongodb').ObjectID;

let  setLike = function(user,id,state) {
  let userId=user;
  let photoId=ObjectId(id);
  let likeStatus = state;

  return  new Promise(function(resolve, reject) {
    let Album = mongoose.model('album');
    Album.where("photos._id").eq(photoId).then(u => {
      var albumid = u[0]._id;
      var photoArray = [];
      var likeArray = [];
      var findPhoto = false;
      var findLike = false;
      var error = false;
      photoId=photoId.toString();
      u[0].photos.map(photo=> {
        if (photo._id == photoId){
          findPhoto=true;
          photo.likes.map(like=> {
            if( like.user == userId){
              if(likeStatus==true){
                throw new Error('Повторно нельзя оставить лайк');
                return;
              }
              findLike = true;
            }else {
              likeArray.push(like);
            }
          });
          if(likeStatus==true){
            likeArray.push({
              user: userId,
              date: (new Date).getTime()
            });
          } else if(!findLike){
            if(likeStatus==true){
              throw new Error('Повторно нельзя отменить оставить лайк');
              return;
            }
          }
          photo.likes = likeArray;
        }
        photoArray.push(photo);
      });
      if (!findPhoto) {
        throw new Error('Фото не найдено');
        return;
      }
      return Album.findOneAndUpdate({_id:albumid},{photos:photoArray},{upsert:true});
    }).then( u => {
      if (u) {
        resolve({iLike: likeStatus});
      }else{
        throw new Error('Ошибка сохранения');
      }
    }, err => {
      resolve({error: err.message || 'Неизвестная ошибка'});
    })
  })
};

module.exports = {
  set: setLike
};