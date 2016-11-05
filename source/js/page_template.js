'use strict';

var pageTemplate = (function() {
  var templateBase = {
    main: {
      headerTemplate: 'header_main',
      contentTemplate: 'content_main',
      photos: false,
      album: {
        ajax_url: '/ajax/album/get/',
        box: '.my-albums__list'
      },
    },
    album: {
      headerTemplate: 'header_album',
      contentTemplate: 'content_album',
      photos: {
        ajax_url: '/ajax/main/',
        box: '.photo-albums__list'
      }
    },
    user: {
      contentTemplate: 'content_user',
      album: {
        ajax_url: '/ajax/main/',
        box: '.my-albums__list'
      }
    },
  };

  var init = function(updateFunction) {

  };

  var update = function(data) {
    var template = data.template.replace('.html', '');

    if (!templateBase[template]) return false;

    template = templateBase[template];

    var headerTemplate = template.headerTemplate;
    headerTemplate = templates[headerTemplate]();
    $('#header').html(headerTemplate);

    var contentTemplate = template.contentTemplate;
    contentTemplate = templates[contentTemplate]();
    $('#content').html(contentTemplate);


    if(template.photos) {
      _functionAdd(template.photos, data.data);
    }

    if(template.album) {
      _functionAdd(template.album, data.data);
    }

    return true;
  };


  var _functionAdd = function(data, urlParam, callbackFunction) {
    var url = data.ajax_url + urlParam;
    $.post(url, function(djson) {
      callbackFunction(djson, data.box);
    }, 'json');
  };

  return {
    update: update,
    init: init
  };
}());
