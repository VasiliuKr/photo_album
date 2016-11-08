'use strict';

var pageTemplate = (function() {
  var templateBase = {
    main: { // Cтартовая
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
    album: { // Карточка альбома
      headerTemplate: 'header_album',
      contentTemplate: 'content_album',
      photos: {
        ajax_url: '/ajax/photo/get',
        box: '.photo-albums__list'
      }
    },
    user: { // Альбомы пользователя
      headerTemplate: 'header_user',
      contentTemplate: 'content_user',
      album: {
        ajax_url: '/ajax/album/get',
        box: '.my-albums__list'
      }
    },
    search: { // Поиск
      headerTemplate: 'header_search',
      contentTemplate: 'content_search',
      photos: {
        ajax_url: '/ajax/main/',
        box: '.photo-albums__list'
      }
    }
  };

  var dataAlbum;
  var dataPhoto;
  var animationContent;
  var template;

  var init = function(updateFunction) {

  };

  var update = function(data) {
    template = data.template.replace('.html', '');

    if (!templateBase[template]) return false;

    dataAlbum = false;
    dataPhoto = false;
    animationContent = false;

    // 1.
    // 2. По заврешнию анимации очищения центрального блока : аниматионконтент тру, проверить есть ли в блоке датафото отправить данные на прорисовку, if data.photo вызвать photo.set (dataPhoto, template.photos.box)
    // 3. Скролл страницы вверх
    // 4. Все дочернии блоки контента анимированно убрать (анимация уменьшение высоты или прозрачность)
    // 5. Сделать заготовку прелоудера
    // $('#content >*').animate ({height: 0}, 300, функцияч по завершению анимации, написать
    // - выбрать все дочернии элементы


    template = templateBase[template];

    var headerTemplate = template.headerTemplate;
    headerTemplate = templates[headerTemplate]();

    $('#header').find('.wrapper-hide').remove();
    var headerWrapper = $('#header').find('.header__wrapper');
    if (headerWrapper.length > 0) {
      var oldHeight = $('#header').height();
      headerWrapper.hide();
      $('#header').append(headerTemplate);
      var newHeight = $('#header').height();
      headerWrapper.addClass('wrapper-hide');
      headerWrapper.show();
      // if (headerWrapper.show()) {
      //   $('#content >*').animate({height: 0}, 300, animationEnd());
      // }
      $('#header')
        .css({height: oldHeight})
        .animate({height: newHeight}, 1000, function() {
          $(this).css({height: ''});
        });
    } else {
      $('#header').html(headerTemplate);
    }

    function animationEnd() {
      animationContent = true;
      if (data.photo) {
        photo.set(dataPhoto, template.photos.box);
      }
    }

    if (animationContent) return false;

    var contentTemplate = template.contentTemplate;
    contentTemplate = templates[contentTemplate]();
    $('#content').html(contentTemplate);

    /* if (template.photos) {
     _functionAdd(template.photos, data.data, dataPhoto, photo.set);
     var url = template.photos.ajax_url + data.data;
     $.post(url, function(djson) {
     dataPhoto = djson;
     if (animationContent) {
     photo.set(djson, data.box);
     }
     }, 'json');
     } */

    /* if (template.album) {
     _functionAdd(template.album, data.data, dataAlbum, album.set);
     var url = template.album.ajax_url + data.data;
     $.post(url, function(djson) {
     dataAlbum = djson;
     if (animationContent) {
     album.set(djson, data.box);
     }
     }, 'json');
     } */

    return true;
  };

  // var _functionAdd = function(data, urlParam, callbackFunction) {
  //   var url = data.ajax_url + urlParam;
  //   $.post(url, function(djson) {
  //     callbackFunction(djson, data.box, callbackFunction);
  //   }, 'json');
  // };

  return {
    update: update,
    init: init
  };
})();
