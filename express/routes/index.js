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

route.get('/album/*',(req,res)=> {
  console.log('album:'+req.session.userId);
  res.render('main')
});

route.get('/search/*',(req,res)=> {
  console.log('search:'+req.session.userId);
  res.render('main')
});

route.get('/user/*',(req,res)=> {
  console.log('user:'+req.session.userId);
  res.render('main')
});

module.exports = route;