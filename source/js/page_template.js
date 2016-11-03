'use strict';

var pageTemplate = (function() {
  var template__base = {
    main: {
      content_template: 'content_main',
      photos: {
        ajax_url:'/ajax/main/',
        box: '.photo-albums__list',
        canEdit: false
      },
      album: {
        ajax_url:'/ajax/main/',
        box: '.my-albums__list',
        canEdit: true
      }
    }
  }

  var init = function(updateFunction) {

  };

  var update = function(data) {
    return true;
  };

  var template = data.template.replace('.html', '');

  if (!template__base[template]) return false;

  template = template__base[template];
  var content_template = template['content_template'];
  content_template = templates[content_template]();

  $('#content').html(content_template);

  var _functionAdd = function(data,url_param,callbackFunction) {
    url=data.ajax_url+url_param,
    /*$.post(url,function(djson){
     callbackFunction(djson,data.box)
     },'json')*/
    callbackFunction({},data.box,data.canEdit)
  };

  if(template.photos){
    _functionAdd(template.photos,data.data,photo.set);
   }

  if(template.album) {
    _functionAdd(template.album, data.data, album.set);
  }

  return {
    update: update,
    init: init
  };
  
}());



