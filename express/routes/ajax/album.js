'use strict';

let route = require('express').Router(),
  mongoose = require('mongoose');
require('./../../models/album');
require('./../../models/photo');

route.post('/create',(req,res)=> {
  let Model = mongoose.model('album'),
    item = new Model({
      title:req.body.name,
      date:req.body.data,
      body:req.body.text
    });

  item.save().then(
    i=> res.send(JSON.stringify({message:'Запись добавленна!'})),
    e=>{
      let error = Object.key(e.errors)
        .map(key=>e.errors[key].message)
        .join(', ');

      res.send(JSON.stringify({error:error}));
    }
  )
  res.send('create');
});


route.post('/update',(req,res)=> {

  res.send('update');
});

route.post('/get',(req,res)=> {

  res.send('get');
});

route.post('/delete',(req,res)=> {

  res.send('delete');
});


module.exports = route;