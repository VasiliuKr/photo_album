'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoLikeSchema = new Schema({
    photo:{ type: Number, ref: 'photo' },
    user:{ type: Number, ref: 'user' }
  });

mongoose.model('photo_like',PhotoLikeSchema);