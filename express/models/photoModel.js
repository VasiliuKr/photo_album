'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs'),
  crypto=require('crypto'),
  thumb = require('node-thumbnail').thumb;
require('./../models_db/photo');

let getPath = function(userId,albomId) {
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

  dirName+='/'+albomId;
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

let loadPhoto = function(path,files){
  return  new Promise(function(resolve, reject) {
    let picture=files.map((file,key)=>{
      let fileName=file.path.split('.');
      fileName=fileName[fileName.length-1];
      fileName=crypto.createHash('md5').update(file.path).digest('hex')+'.'+fileName;

      let newFilePath=path+'/'+fileName;
      fs.writeFileSync(newFilePath,fs.readFileSync(file.path));

      thumb({
        source: newFilePath, // could be a filename: dest/path/image.jpg
        destination: path+'/_thumbs',
        concurrency: 4,
        width: 800,
        suffix:'',
        quiet:true
      });
      return fileName;
    });
    resolve(picture);
  })
};

let add = function(userId, albumId, files, fields) {
  return  new Promise(function(resolve, reject) {
    let resolveCallback=resolve;
    let Photo = mongoose.model('photo');
    Photo.findOne({},{},{ sort: { '_id' : -1 }}).then(u=> {
      let path,
        photoId=1;
      if(u){
        photoId=u._id;
      }
      path=getPath(userId,albumId);
      loadPhoto(path.server,files).then(files=> {
        let fileList = [];
        files.map((file, key)=> {
          if (file) {
            photoId++;
            fileList.push(photoId);
            let photoData = {
              _id: photoId,
              album: albumId,
              src: file,
              dir: path.browser
            };
            if (fields) {
              photoData.title = fields.title[0] || '';
              photoData.description = fields.description[0] || '';
              photoData.tags = fields.description[0] || '';
            }
            Photo.collection.insert(photoData);
          }
        });
        resolveCallback({photoId: photoId, fileList: fileList});
      })
    });
  });
};

let  get = function(filer) {
  if (!filer)filer={};
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let photo = mongoose.model('photo');
    photo.find(filer,{},{ sort: { '_id' : -1 }} ).then(u => {
      resolveCallback(u);
    })
  })
};

let  getLast = function() {
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let photo = mongoose.model('photo');
    photo.find(filer,{},{ sort: { '_id' : -1 }}).populate('user').limit(60).then(u => {
      resolveCallback(u);
    })
  })
};

module.exports = {
  add: add,
  get: get,
  getLast: getLast,
  getPath: getPath,
  loadPhoto: loadPhoto
};