'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose'),
  multiparty = require('multiparty'),
  photoModel=require('./../../models/photoModel'),
  albumModel=require('./../../models/albumModel'),
  userModel=require('./../../models/userModel'),
  commentModel=require('./../../models/commentsModel');
require('./../../models_db/album');

route.post('/add',(req,res)=> {
  commentModel.add(req.body.photo,req.session.userId,req.body.text).then( u => {
    console.log(u);
  })
});

module.exports = route;