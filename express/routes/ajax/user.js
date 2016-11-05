'use strict';

let route = require('express').Router(),
  crypto=require('crypto'),
  mongoose = require('mongoose');
require('./../../models_db/user');

route.post('/registration',(req,res)=>{
  if(!req.body.name || !req.body.password || !req.body.mail){
    return res.send(JSON.stringify({error:'Укажите логин,пароль и email!'}));
  };
  var password=crypto.createHash('md5').update(req.body.password).digest("hex");

  let User = mongoose.model('user');
  User.findOne({},{},{ sort: { '_id' : -1 }}).then(u=> {
    let userId=1;
    if(u){
      userId=u._id+1;
    };
    let newUser = new User({
        _id: userId,
        login: req.body.mail,
        password: password,
        email: req.body.mail,
        name: req.body.name
      });

    User.findOne({login: req.body.mail}).then(u=> {
      if (u) {
        throw new Error('Такой пользователь уже существует');
      };
      return newUser.save();
    }).then(
      u=> {
        req.session.isAuth = true;
        req.session.userId = u._id;
        res.send(JSON.stringify({error: 0, message: 'Успешная регистрация', href: '/main'}));
      },
      e=> {
        res.send(JSON.stringify({error: e.message}))
      }
    ).then(()=>res.send(JSON.stringify({error: 'Неизвестная ошибка'})))
  });
});


route.post('/login',(req,res)=>{
  console.log('autorisaton');

  if(!req.body.mail || !req.body.password){
    return res.send(JSON.stringify({error:'Укажите логин и пароль!'}));
  }

  let Model=mongoose.model('user'),
    password=crypto.createHash('md5')
      .update(req.body.password)
      .digest('hex');

  Model.findOne({
    login:req.body.mail,
    password:password
  }).then(item=>{
    if(!item){
      res.send(JSON.stringify({error:'Логин и/или пароль введены неверно!'}));
    }else{
      req.session.isAuth=true;
      req.session.userId=item._id;
      res.send(JSON.stringify({href:'/main',message:'Успешная авторизация'}));
    }
  })
});
route.post('/restorepassword',(req,res)=> {
  let nodemailer = require('nodemailer'),
      config = require('./../../config/server.config.json'),
      password=(Math.floor(Math.random() * 99999999999999) + 100000000000).toString(),
      password_md5=crypto.createHash('md5')
        .update(password)
        .digest('hex'),
      transporter = nodemailer.createTransport(config.mail.smtp),
      mailOptions={
        from: `"${config.mail.fromName}"<${config.mail.fromMail}>`,
        to:req.body.mail,
        subject: config.mail.subject,
        text:'Ваш новый пароль: '+password
      },
      User =mongoose.model('user');

  User.findOne({email:req.body.mail}).then(u=>{
    if(!u){
      throw new Error('Такой пользователь не существует');
    }
    return User.update({email:req.body.mail},{password:password_md5});
  }).then(
    u=> {
      return transporter.sendMail(mailOptions,function (err,info) {
        if(err){
          return res.send(JSON.stringify({error:err.message}));
        }
        return res.json({error:0,message:'Новый пароль отправленн вам на почту.'});
      })
    },
    e=>{
      res.send(JSON.stringify({error:e.message}))
    }
  )

});
module.exports = route;