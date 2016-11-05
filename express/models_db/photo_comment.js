'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoCommentSchema = new Schema({
    photo:{ type: Number, ref: 'photo' },
    user:{ type: Number, ref: 'user' },
    commet:{
      type: String
    }
  });

mongoose.model('photo_comment',PhotoCommentSchema);