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


  return {
    server: uploadDir,
    browser: dirName
  };
};

let  getUser = function(userId) {
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let User = mongoose.model('user');
    User.findOne({'_id':userId}).then(u => {
      delete u.password;
      let path = getPath(u._id);
      u.background=(
        u.background.length<3?
        u.background=config.style.userBackground :
        path.browser+'/'+u.background
      );
      u.photo=(
        u.photo.length<3?
          u.photo=config.style.userPhoto :
        path.browser+'/'+u.photo
      );
      resolveCallback(u);
    })
  })
};

module.exports = {
  get: getUser
};