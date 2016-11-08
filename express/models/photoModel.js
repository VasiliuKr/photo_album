'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs'),
  crypto=require('crypto'),
  thumb = require('node-thumbnail').thumb;

let loadPhoto = function(path,files){
  return  new Promise(function(resolve, reject) {
    let picture=files.map((file,key)=>{
      if(file.size<100) return false;

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

let unlinkPhoto = function(path,files){
  return  new Promise(function(resolve, reject) {
    if(files.length>0) {
      files.map((file, key)=> {
        fs.unlink(path + '/_thumbs/' + file);
        fs.unlink(path + '/' + file);
      });
    }
    resolve();
  })
};

let createPhotoArray = function(files,dir,fields){
  return  new Promise(function(resolve, reject) {
    loadPhoto(dir,files).then(files=> {
      let fileList=[];
      fields.created=(new Date).getTime();
      files.map((file)=> {
        if (file) {
          let photoData = Object.assign({},fields);
          photoData.src=file;
          fileList.push(photoData);
        }
      });
      resolve(fileList);
    })
  })
};

let  get = function(filter,user) {
  if (!filter)filter={};
  let userId=user;
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let startParametr={
      _id:'$photos._id',
      album_id:'$_id',
      dir:'$dir',
      user:'$user',
      src:'$photos.src',
      created:'$photos.created',
      is_cover:'$photos.is_cover',
      comments:'$photos.comments',
      likes:'$photos.likes',
      tags:'$photos.tags'
    };
    let Album = mongoose.model('album');
    Album.aggregate(
      {$unwind: "$photos"},
      {$project: startParametr},
      {$match: filter},
      {$sort: {created:-1}},
      {$limit: 60}
    ).then(u => {
      u.map(photo=>{
        photo.canEdit=(photo.user==userId);
        photo.iLike=false;
        photo.likes.map(like=>{
          if(like.user==userId){
            photo.iLike=true;
          }
        });
        photo.likes=photo.likes.length;
        photo.comments=photo.comments.length;
      });
      resolveCallback(u);
    })
  })
};

module.exports = {
 /* add: add,
  getLast: getLast,
  get: get,
  getPath: getPath,*/
  get: get,
  loadPhoto: loadPhoto,
  unlinkPhoto: unlinkPhoto,
  createPhotoArray: createPhotoArray
};
