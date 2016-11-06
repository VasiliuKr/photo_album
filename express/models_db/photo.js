'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoSchema = new Schema({
    _id:{
      type:Number,
      required:true
    },
    album:{ type: Number, ref: 'album' },
    title:{
      type: String
    },
    src: {
      type: String
    },
    dir: {
      type: String
    },
    description: {
      type: String
    },
    tags: {
      type: String
    }
  });

mongoose.model('photo',PhotoSchema);