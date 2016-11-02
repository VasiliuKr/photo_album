'use strict';

let mongoose = require('mongoose'),
  Schema=mongoose.Schema,
  PhotoSchema = new Schema({
    albom:{
      type: String
    },
        title:{
      type: String
    },
    src: {
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