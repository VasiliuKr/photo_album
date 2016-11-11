'use strict';

let route = require('express').Router(),
  likeModel=require('./../../models/likesModel');

route.post('/set',(req,res)=> {
  likeModel.set(req.session.userId, req.body.photoId, req.body.set).then( u => {
    u.iLike = req.body.set;
    u.photoId = req.body.photoId;
    res.send(JSON.stringify(u));
  });
});

module.exports = route;