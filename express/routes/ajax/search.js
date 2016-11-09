'use strict';

let route = require('express').Router(),
  photoModel=require('./../../models/photoModel'),
  userModel=require('./../../models/userModel'),
  mongoose = require('mongoose');

//Фото в альбоме
route.post('/',(req,res)=> {
  var query = {};
  if (req.query.search){
    query.$or=[
        { title: { $regex: req.query.search, $options: 'i'}},
        { description: { $regex: req.query.search, $options: 'i'}}
    ];
  }else if(req.query.tag){
    //поиск по тегам
    query.tag = { tags : req.query.tag.replace('#','')}
  } else {
    //ошибка входных данных
    res.send(JSON.stringify({
      error: 'Нет данных для обработки запроса'
    }));
    return false;
  }

  //Поиск и вывод результата
  photoModel.get(query).then( u => {
    let user_list=[];
    u.map((album)=> {
      user_list.push(album.user);
    });
    userModel.get({ "$in" : user_list}).then(user => {
      res.send(JSON.stringify({
        data: u,
        user: user
      }))
    })
  })
});

module.exports = route;