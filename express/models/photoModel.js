'use strict';

let mongoose = require('mongoose'),
  config = require('./../config/server.config.json'),
  path = require('path'),
  fs = require('fs'),
  crypto=require('crypto'),
  easyimg = require('easyimage'),
  ObjectId = require('mongodb').ObjectID;//,
  //albumModel=require('./albumModel');

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

let createThumb = function(path,file){
  return  new Promise(function(resolve, reject) {
    if(file.size<100) return false;
    console.log('-'+file.path);
    var fileName=file.path.split('.');
    fileName=fileName[fileName.length-1];
    fileName=crypto.createHash('md5').update(file.path).digest('hex')+'.'+fileName;

    var newFilePath=path+'/'+fileName;
    fs.writeFileSync(newFilePath,fs.readFileSync(file.path));
    easyimg.thumbnail({
      src:newFilePath,
      dst:path+'/_thumbs/'+fileName,
      width: 800,
    }).then(image => {
      resolve(image.name)
    });
   })
};

let loadPhoto = function(path,files){
  var outArray = [];
  return  new Promise(function(resolve, reject) {
    console.log(files.length);
    files.map((file,key)=> {
      createThumb(path, file).then(e => {
        outArray.push(e);
        if(outArray.length == files.length){
          resolve(outArray);
        }
      })
    })
  })
};

let unlinkPhoto = function(path,files){
  return  new Promise(function(resolve, reject) {
    if(files.length>0) {
      files.map((file, key)=> {
        if(fs.existsSync('/_thumbs/' + file)) {
           fs.unlink(path + '/_thumbs/' + file);
        }
        if(fs.existsSync('/_thumbs/' + file)) {
          fs.unlink(path + '/' + file);
        }
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


let  getPhotos = function(filter,user) {
  if (!filter)filter={};
  let userId=user;
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let startParametr={
      _id: '$photos._id',
      album_id:'$_id',
      album_title:'$title',
      dir:'$dir',
      user:'$user',
      src:'$photos.src',
      created:'$photos.created',
      is_cover:'$photos.is_cover',
      comments:'$photos.comments',
      likes:'$photos.likes',
      tags:'$photos.tags',
      title:'$photos.title',
      description:'$photos.description'
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
        if(!photo.title || photo.title.length==0){
          photo.title = 'Без заголовка';
        }
        if(!photo.description || photo.description.length==0){
          photo.description = 'Описание пока не заполнено';
        }
      });
      resolveCallback(u);
    })
  })
};

let _findTag = function(str){
  const regex = /(#[a-zA-Zа-яА-Я0-9]+)/gi;
  let outTag = [];
  let m;

  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m = m[0].replace('#', '');
    if (outTag.indexOf(m) == -1) {
      outTag.push(m);
    }
  }

  return outTag;
};

let  update = function(id,user,newData) {
  let userId=user;
  let photoId=id;
  let albumid;
  return  new Promise(function(resolve, reject) {
    let Album = mongoose.model('album');
    Album.where("photos._id").eq(photoId).then(u => {
      if (!u || u.length == 0 || u[0].user != userId) {
        throw {error: 'Ошибка доступа'};
        return;
      }
      albumid = u[0]._id;
      var photoArray = [];
      u[0].photos.map(photo=> {
        if (photo._id == photoId){
          photo.title = newData.title;
          photo.description = newData.description;
          photo.tags = _findTag(newData.title + ' ' + newData.description);
        }
        photoArray.push(photo);
      });
      return Album.findOneAndUpdate({_id:albumid},{photos:photoArray},{upsert:true});
    }).then(u => {
      let filter={
        _id: ObjectId(photoId),
        album_id: albumid
      };
      return getPhotos(filter, userId);
    }).then( u => {
        resolve(u);
    }, err => {
      resolve({error: err.error || 'Неизвестная ошибка'});
    })
  })
};

let  deletePhoto = function(id,user,path) {
  let userId=user;
  let photoId=id;
  return  new Promise(function(resolve, reject) {
    let Album = mongoose.model('album');
    Album.where("photos._id").eq(photoId).then( u => {
      if (!u || u.length == 0 || u[0].user != userId) {
        throw {error: 'Ошибка доступа'};
        return;
      }
      let albumid = u[0]._id;
      let path = getPath(userId, u[0]._id);

      var photoArray = [];
      u[0].photos.map(photo=> {
        if (photo._id != photoId){
          photoArray.push(photo);
        }else {
          if (photo.is_cover) {
            throw {error: 'Нельзя удалить обложку'};
            return;
          }
          unlinkPhoto(path.server,photo.src);
        }
      });
      return Album.findOneAndUpdate({_id:albumid},{photos:photoArray},{upsert:true});
    }).then( u => {
      resolve({'delete': photoId});
    }, err => {
      resolve({error:err.error});
    })
  })
};

module.exports = {
  get: getPhotos,
  update: update,
  deletePhoto: deletePhoto,
  loadPhoto: loadPhoto,
  unlinkPhoto: unlinkPhoto,
  createPhotoArray: createPhotoArray
};
