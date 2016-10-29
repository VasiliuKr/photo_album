'use strict';

let route = require('express').Router();


route.get('/',(req,res)=> {
  console.log('index');
  res.render('index')
});


module.exports = route;