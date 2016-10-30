'use strict';

let mongoose = require('mongoose'),
  crypto=require('crypto'),
  Schema=mongoose.Schema,
  UserSchema = new Schema({
    login:{
      type:String,
      required:[true,'Укажите логин']
    },
    password:{
      type:String,
      required:[true,'Укажите пароль'],
      set(v){
        if(v !=''){
          return v;
        }else{
          return crypto.createHash('md5').update(v).digest('hex')
        }
      }
    },
    name:{
      type:String,
      required:[true,'Укажите имя']
    },
    photo:{
      type:String,
      default:''
    },
    background:{
      type:String,
      default:''
    },
    description:{
      type:String,
      default:''
    },
    email:{
      type:String,
      default:''
    },
    vk:{
      type:String,
      default:''
    },
    fb:{
      type:String,
      default:''
    },
    twitter:{
      type:String,
      default:''
    },
    google:{
      type:String,
      default:''
    }
  });

mongoose.model('user',UserSchema);