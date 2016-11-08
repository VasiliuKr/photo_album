'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs');
require('./../models_db/user');

let getPath = function(userId) {
  let dirName='upload/'+Math.ceil(userId/100);

  let uploadDir = path.resolve(config.http.publicRoot,dirName);
  if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
  }

  dirName+='/'+(userId % 100);
  uploadDir = path.resolve(config.http.publicRoot,dirName);
  if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
  }

  let thumbsDir = path.resolve(config.http.publicRoot,dirName+'/_thumbs');
  if(!fs.existsSync(thumbsDir)){
    fs.mkdirSync(thumbsDir);
  }

  return {
    server: uploadDir,
    browser: dirName
  };
};

let  getUser = function(userId) {
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let User = mongoose.model('user');
    let startParametr={
      "_id":1,
      "login":1,
      "name":1,
      "google":1,
      "twitter":1,
      "fb":1,
      "vk":1,
      "email":1,
      "description":1,
      "background":1,
      "photo":1
    };
    User.aggregate(
      {$project: startParametr},
      {$match: {'_id':userId}}
    ).then(users => {
      users.map(u=> {
        let path = getPath(u._id);
        u.background = (
          u.background.length < 3 ?
            u.background = config.style.userBackground :
          path.browser + '/' + u.background
        );
        u.photo = (
          u.photo.length < 3 ?
            u.photo = config.style.userPhoto :
          path.browser + '/' + u.photo
        );
      });
      resolveCallback(users);
    })
  })
};

module.exports = {
  get: getUser,
  getPath: getPath
};