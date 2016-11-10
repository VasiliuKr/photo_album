'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose'),
  multiparty = require('multiparty'),
  userModel=require('./../../models/userModel'),
  photoModel=require('./../../models/photoModel');
require('./../../models_db/album');

route.post('/social',(req,res)=> {
  let newUserSocial={};
  let names = ['vk','fb','twitter','google','email'];
  for (var i = 0;i<names.length;i++) {
    if (req.body[names[i]] && req.body[names[i]].length>2) {
      newUserSocial[names[i]] = req.body[names[i]];
    }
  }
  if(newUserSocial.length<1) {
    res.send(JSON.stringify({error:'Нет данных для сохранения или не соответствуют формату.'}));
    return;
  }
  let User = mongoose.model('user');
  User.findOneAndUpdate({_id: req.session.userId}, newUserSocial, {upsert: true}).then( u => {
    userModel.get(req.session.userId).then(user => {
      res.send(JSON.stringify({
        error  : 0,
        message: 'Данные пользователя обновленны.',
        data   : user
      }))
    })
  });
});

route.post('/update',(req,res)=> {
  let form= new multiparty.Form();
  form.parse(req,function(err,fields,files) {
    if (
      !fields.name ||
      fields.name[0].length < 3 ||
      !fields.description ||
      fields.description[0].length < 3
    ) {
      res.send(JSON.stringify({error: 'Имя и описание должны быть заполнены'}));
      return;
    }
    var newUserData = {
      name: fields.name[0],
      description: fields.description[0]
    };

    var fileToDel = [];
    var path = userModel.getPath(req.session.userId);
    var oldData;

    let User = mongoose.model('user');
    User.findOne({_id:req.session.userId}).then( u => {
      oldData = u;
      return photoModel.loadPhoto(path.server,files['avatar']);
    }).then( avatar => {
      if(avatar.length>0 && avatar[0]){
        newUserData.photo = avatar[0];
        if(oldData.photo.length>5){
          fileToDel.push(oldData.photo);
        }
      }
      return photoModel.loadPhoto(path.server,files['background']);
    }).then( background => {
      console.log(background);
      if (background.length > 0 && background[0]) {
        newUserData.background = background[0];
        if (oldData.background.length > 5) {
          fileToDel.push(oldData.background);
        }
      }
      console.log(fileToDel);
      return photoModel.unlinkPhoto(path.server,fileToDel);
    }).then( u => {
      return User.findOneAndUpdate({_id: req.session.userId}, newUserData, {upsert: true});
    }).then( u => {
      userModel.get(req.session.userId).then(user => {
        res.send(JSON.stringify({
          error: 0,
          message: 'Данные пользователя обновленны.',
          data: user
        }))
      })
    }).then(message=>res.send(JSON.stringify({error: message.error})));
  });
});

route.post('/get/',(req,res)=> {
  userModel.get( req.session.userId).then(user => {
    var outData = { data: user };
    if(req.query.search){
      outData.search = req.query.search;
    }
    if(req.query.tag){
      outData.search = '#'+req.query.tag;
    }
    res.send(JSON.stringify(outData))
  })
});

route.post('/get/:id',(req,res)=> {
  userModel.get( parseInt(req.params.id)).then(user => {

    var outData = { data: user };
    if(req.query.search){
      outData.search = req.query.search;
    }
    if(req.query.tag){
      outData.search = '#'+req.query.tag;
    }
    res.send(JSON.stringify(outData))
  })
});

module.exports = route;