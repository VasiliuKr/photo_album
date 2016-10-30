'use strict';

let route = require('express').Router();


route.get('/',(req,res)=> {
  console.log('index');
  res.render('index')
});

route.get('/logout',(req,res)=> {
  console.log('logout:'+req.session.userId);
  req.session.isAuth=false;
  req.session.userId=false;
  res.redirect('/');
});


route.get('/photo_main',(req,res)=> {
  console.log('photo_main:'+req.session.userId);
  res.render('photo_main')
});

module.exports = route;