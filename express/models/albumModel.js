'use strict';

let mongoose = require('mongoose');
require('./../models_db/album');

let  getAlbum = function(filer) {
  if (!filer)filer={};
  return  new Promise(function(resolve, reject) {
    let resolveCallback = resolve;
    let Album = mongoose.model('album');
    Album.find(filer,{},{ sort: { '_id' : -1 }} ).populate('cover').then(u => {
      resolveCallback(u);
    })
  })
};

module.exports = {
  get: getAlbum
};