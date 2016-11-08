'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose'),
  multiparty = require('multiparty'),
  photoModel=require('./../../models/photoModel'),
  albumModel=require('./../../models/albumModel'),
  userModel=require('./../../models/userModel');
  require('./../../models_db/album');

route.post('/create',(req,res)=> {
  let form= new multiparty.Form();

  form.parse(req,function(err,fields,files){
    if(err){
      return res.send(JSON.stringify({error:err.message||err}))
    }

    let Model = mongoose.model('album');
    Model.findOne({},{},{ sort: { '_id' : -1 }}).then(u=> {
      let albumId=1;
      if(u){
        albumId=u._id+1;
      };
      let path = albumModel.getPath(req.session.userId,albumId);
      photoModel.createPhotoArray(files.cover,path.server, {is_cover: true}).then(photos=>{
        if(!photos){
          throw res.send(JSON.stringify({err:'Ошибка загрузки обложки'}));
        }
        let item = new Model({
          _id: albumId,
          user:req.session.userId,
          title:fields.title[0],
          description:fields.description[0],
          dir: path.browser,
          photos:photos
        });
        item.save().then(
          i=> {
            albumModel.get({_id:albumId},req.session.userId).then(u => {
              res.send(JSON.stringify({
                error: 0,
                message: 'Альбом создан!',
                data: u
              }))
            })
          },
          e=>{
            let error = Object.key(e.errors)
              .map(key=>e.errors[key].message)
              .join(', ');

            res.send(JSON.stringify({error:error}));
          }
        );
      });
    })
  })
});


route.post('/update',(req,res)=> {
  let form= new multiparty.Form();
  form.parse(req,function(err,fields,files) {
    let albumid = parseInt(fields.id[0]);
    let Album = mongoose.model('album');
    let oldPhotos;
    let newData;
    let path;
    Album.findOne({_id:albumid}).then( u => {
      if (!u || u.length == 0 || u.user != req.session.userId) {
        throw new Error({error: 'Ошибка доступа'});
        return;
      }
      oldPhotos=u.photos;
      newData = {
        title: fields.title[0],
        description: fields.description[0]
      };
      path = albumModel.getPath(u.user, u._id);
      return photoModel.loadPhoto(path.server,files['cover']);
    }).then(photos=>{
      if(photos.length>0 && photos[0]!==false){
        oldPhotos.map((photo)=> {
          if(photo.is_cover){
            photoModel.unlinkPhoto(path.server,photo.src);
            photo.src=photos[0];
            return photo;
          }
        });
        newData['photos']=oldPhotos;
      }
      Album.findOneAndUpdate({_id:albumid},newData,{upsert:true}).then(albums=>{
        let photo_list=[];
        photos.map(photo=>{
          photo_list.push(photo.src);
        });
        albumModel.get({_id:albumid}, req.session.userId).then(u => {
          res.send(JSON.stringify({
            error: 0,
            message: 'Альбом создан!',
            data: u
          }))
        });
      });
    }).then(message=>res.send(JSON.stringify({error: message.error})));;
  });
});

route.post('/get/',(req,res)=> {
  albumModel.get({user:req.session.userId},req.session.userId).then(u => {
    let user_list=[];
    u.map((album)=> {
      user_list.push(album.user);
    });
    userModel.get({ "$in" : user_list}).then(user => {
      res.send(JSON.stringify({
        data: u,
        user: user
      }))
    })
  });
});


//Альбом с данным id (для шапки)
route.post('/get/:id',(req,res)=> {
  albumModel.get({_id: parseInt(req.params.id)},req.session.userId).then(u => {
    let user_list=[];
    u.map((album)=> {
      user_list.push(album.user);
    });
    userModel.get({ "$in" : user_list}).then(user => {
      let outData = {
        background: u[0].dir + '/' + u[0].cover.src,
        data: u[0],
        user: user[0]
      };
      res.send(JSON.stringify({
        data: [outData]
      }))
    })
  });
});

route.post('/get_user/:id',(req,res)=> {
  albumModel.get({user:req.params.id},req.session.userId).then(u => {
    userModel.get(req.session.userId).then(user => {
      res.send(JSON.stringify({
        data: u,
        user: user
      }))
    })
  });
});

route.post('/delete',(req,res)=> {

  res.send('delete');
});


module.exports = route;