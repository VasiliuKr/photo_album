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


route.get('/main',(req,res)=> {
  console.log('main:'+req.session.userId);
  res.render('main')
});

module.exports = route;