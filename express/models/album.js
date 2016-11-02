'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  AlbomSchema = new Schema({
    user:{
      type:String,
      required:[true,'Укажите пользователя']
    },
    title:{
      type:String,
      required:[true,'Укажите название альбома']
    },
    description:{
      type:String,
      required:[true,'Укажите описание альбома']
    },
    cover:{
      type:String,
      required:[true,'Укажите обложку альбома']
    }
  });

mongoose.model('albom',AlbomSchema);