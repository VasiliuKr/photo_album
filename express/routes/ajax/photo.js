'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose'),
  multiparty = require('multiparty'),
  photoModel=require('./../../models/photoModel'),
  albumModel=require('./../../models/albumModel'),
  userModel=require('./../../models/userModel');
require('./../../models_db/album');


route.post('/add',(req,res)=> {
  let form= new multiparty.Form();
  form.parse(req,function(err,fields,files) {
    let albumid = parseInt(fields.id[0]);
    let Album = mongoose.model('album');
    let oldPhotos;
    Album.findOne({_id:albumid}).then( u => {
      if (!u || u.length == 0 || u.user != req.session.userId) {
        throw new Error({error: 'Ошибка доступа'});
        return;
      }
      oldPhotos=u.photos;
      let path = albumModel.getPath(u.user, u._id);
      return photoModel.createPhotoArray(files['photos[]'], path.server, {is_cover: false})
    }).then(photos=>{
      let totPhotos=oldPhotos.concat(photos);
      Album.findOneAndUpdate({_id:albumid},{photos:totPhotos},{upsert:true}).then(albums=>{
        let photo_list=[];
        photos.map(photo=>{
          photo_list.push(photo.src);
        });
        let filter={
          album_id:albumid,
          src: {$in:photo_list}
        };
        photoModel.get(filter,req.session.userId).then( u => {
          res.send(u);
        });
      });
    }).then(message=>res.send(JSON.stringify({error: message.error})));
  });
});


route.post('/update',(req,res)=> {

  res.send('update');
});

route.post('/get/',(req,res)=> {
  photoModel.get({},req.session.userId).then( u => {
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

route.post('/delete',(req,res)=> {

  res.send('delete');
});


module.exports = route;