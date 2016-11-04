'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoCommentSchema = new Schema({
    photo:{
      type: String
    },
    user:{
      type: String
    },
    commet:{
      type: String
    }
  });

mongoose.model('photo_comment',PhotoCommentSchema);