'use strict';

var pageTemplate = (function() {
  var templateBase = {
    main: {// стартовая
      headerTemplate: 'header_main',
      contentTemplate: 'content_main',
      photos: {
        ajax_url: '/ajax/photo/get/',
        box: '.photo-albums__list'
      },
      album: {
        ajax_url: '/ajax/album/get/',
        box: '.my-albums__list'
      }
    },
    user: { // альбомы пользователя
      headerTemplate: 'header_album',
      contentTemplate: 'content_album',
      album: {
        ajax_url: '/ajax/album/get/',
        box: '.my-albums__list'
      }
    },
    album: { // карточка альбома
      headerTemplate: 'header_user',
      contentTemplate: 'content_user',
      photos: {
        ajax_url: '/ajax/photo/get/',
        box: '.photo-albums__list'
      }
    }
  };

  var init = function(updateFunction) {

  };

  var update = function(data) {
    var template = data.template.replace('.html', '');

    if (!templateBase[template]) return false;

    template = templateBase[template];

    var headerTemplate = template.headerTemplate;
    headerTemplate = templates[headerTemplate]();

    $('#header').find('.wrapper-hide').remove();
    var headerWrapper = $('#header').find('.header__wrapper');
    if(headerWrapper.length > 0) {
      var oldHeight = $('#header').height();
      headerWrapper.hide();
      $('#header').append(headerTemplate);
      var newHeight = $('#header').height();
      headerWrapper.addClass('wrapper-hide');
      headerWrapper.show();
      $('#header')
        .css({height: oldHeight})
        .animate({height: newHeight}, 1000, function() {
          $(this).css({height: ''});
        });
    } else {
      $('#header').html(headerTemplate);
      // ОТключить задержку анимации
    }

    var contentTemplate = template.contentTemplate;
    contentTemplate = templates[contentTemplate]();

    $('#content').html(contentTemplate);


    if(template.photos) {
      _functionAdd(template.photos, data.data, photo.set);
    }

    if(template.album) {
      _functionAdd(template.album, data.data, album.set);
    }

    return true;
  };


  var _functionAdd = function(data, urlParam, callbackFunction) {
    var url = data.ajax_url + urlParam;
    $.post(url, function(djson) {
      callbackFunction(djson, data.box, callbackFunction);
    }, 'json');
  };

  return {
    update: update,
    init: init
  };
}());
