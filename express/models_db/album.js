'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  AlbumSchema = new Schema({
    _id:{
      type:Number,
      required:true
    },
    user:{ type: Number, ref: 'user' },
    title:{
      type:String,
      required:[true,'Укажите название альбома']
    },
    description:{
      type:String,
      required:[true,'Укажите описание альбома']
    },
    cover: { type: Number, ref: 'photo' }
  });


mongoose.model('album',AlbumSchema);