'use strict';

let route = require('express').Router(),
  userModel=require('./../../models/userModel'),
  commentModel=require('./../../models/commentsModel');
require('./../../models_db/album');

route.post('/add',(req,res)=> {
  if(!req.body.text || req.body.text.length<3){
    res.send(JSON.stringify({error:'Вы отправили пустой комментарий'}));
    return;
  }
  commentModel.add(req.body.photo,req.session.userId,req.body.text).then( u => {
    var outData = { myId: req.session.userId };
    commentModel.get(req.body.photo).then( u => {
      if(u.error){
        res.send(JSON.stringify({error:u.error}))
      }
      outData.comments = u;
      var userList = [req.session.userId];
      u.map((comment)=> {
        userList.push(comment.user);
      });
      userModel.get({ "$in" : userList}).then(user => {
        outData.users = user;
        res.send(JSON.stringify(outData));
      });
    })
  })
});

route.post('/get',(req,res)=> {
  var outData = { myId: req.session.userId };
  commentModel.get(req.body.id).then( u => {
    if(u.error){
      res.send(JSON.stringify({error:u.error}))
    }
    outData.comments = u;
    var userList = [req.session.userId];
    u.map((comment)=> {
      userList.push(comment.user);
    });
    userModel.get({ "$in" : userList}).then(user => {
      outData.users = user;
      res.send(JSON.stringify(outData));
    });
  })
});

module.exports = route;