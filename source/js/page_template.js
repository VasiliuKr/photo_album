'use strict';

var pageTemplate = (function() {
  var init = function(updateFunction) {

  };

  var update = function(data) {
    return true;
  };

  return {
    update: update,
    init: init
  };
}());


var template_base={
  photo_main:{
    template:'main',
    photos:{
      ajax_url:'/ajax/main/',
      box:'.photo-albums__list'
    },
    album:false
  }
};

data={tempate:'photo_main',params:''};

if (!template_base[data.tempate]) {
  false;
}

t=template_base[data.tempate]

t.photos.ajax_url+params