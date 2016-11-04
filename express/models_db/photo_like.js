'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoLikeSchema = new Schema({
    photo:{
      type: String
    },
    user:{
      type: String
    }
  });

mongoose.model('photo_like',PhotoLikeSchema);