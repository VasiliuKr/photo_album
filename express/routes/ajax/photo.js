'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose'),
  multiparty = require('multiparty'),
  photoModel=require('./../../models/photoModel'),
  albumModel=require('./../../models/albumModel'),
  userModel=require('./../../models/userModel');
require('./../../models_db/album');
require('./../../models_db/photo');

route.post('/add',(req,res)=> {
  let form= new multiparty.Form();
  form.parse(req,function(err,fields,files) {
    let albomid = fields.albomid[0];
    albumModel.get({_id:albomid}).then( u => {
      if(!u || u[0].user[0]!=req.session.userId){
        res.send(JSON.stringify({error:'Ошибка доступа'}));
        return ;
      }
      photoModel.add(req.session.userId, albomid, files['photos[]']).then( u =>{
        console.log(u.fileList);
        photoModel.get({_id:{ "$in": u.fileList}}).then( u => {
          res.send('photo add');
        });
      });
    });

  })
});


route.post('/update',(req,res)=> {

  res.send('update');
});

route.post('/get/*',(req,res)=> {
  photoModel.getLast().then( u => {
    res.send(u);
  });
});

route.post('/get_user/:id',(req,res)=> {

});

route.post('/delete',(req,res)=> {

  res.send('delete');
});


module.exports = route;