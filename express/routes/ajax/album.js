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
            albumModel.get({_id:albumId}).then(u => {
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

  res.send('update');
});

route.post('/get/*',(req,res)=> {
  albumModel.get({user:req.session.userId}).then(u => {
    userModel.get(req.session.userId).then(user => {
      res.send(JSON.stringify({
        data: u,
        user: user
      }))
    })
  });
});

route.post('/get_user/:id',(req,res)=> {
  albumModel.get({user:req.params.id}).then(u => {
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