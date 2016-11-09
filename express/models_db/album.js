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
    dir: {
      type: String
    },
    photos: [{
      title:{
        type: String
      },
      src: {
        type: String
      },
      created:{"type":Number},
      description: {
        type: String
      },
      tags: {
        type: [String]
      },
      is_cover:{
        type: Boolean
      },
      likes:[{
        user:{ type: Number, ref: 'user' }
      }],
      comments:[{
        user:{ type: Number, ref: 'user' },
        date:{ type: String },
        comment:{ type: String}
      }]
    }]
  });


mongoose.model('album',AlbumSchema);