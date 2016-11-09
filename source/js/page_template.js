'use strict';

var pageTemplate = (function() {
  var templateBase = {
    main: { // Cтартовая
      headerTemplate: 'header_main',
      contentTemplate: 'content_main',
      headerData: '/ajax/user/get/',
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
      headerData: '/ajax/album/get/',
      photos: {
        ajax_url: '/ajax/photo/get/',
        box: '.photo-albums__list'
      }
    },
    user: { // Альбомы пользователя
      headerTemplate: 'header_user',
      headerData: '/ajax/user/get/',
      contentTemplate: 'content_user',
      album: {
        ajax_url: '/ajax/album/get_user/',
        box: '.my-albums__list'
      }
    },
    search: { // Поиск
      headerTemplate: 'header_search',
      headerData: '/ajax/user/get/',
      contentTemplate: 'content_search',
      photos: {
        ajax_url: '/ajax/search/',
        box: '.photo-albums__list'
      }
    }
  };

  var dataAlbum;
  var dataPhoto;
  var animationContent;
  var template;
  var headerWrapper;

  var init = function(updateFunction) {

  };

  var headerRender = function(resizeHeader, urlSufix) {
    var waitResize = resizeHeader;
    var headerTemplate = template.headerTemplate;

    var url = template.headerData + urlSufix;
    $.post(url, function(djson) {
      headerTemplate = templates[headerTemplate](djson.data[0]);
      var oldHeight;
      if(waitResize) {
        oldHeight = $('#header').height();
        headerWrapper.hide();
      }

      $('#header').append(headerTemplate);
      $('.page_background').css('background-image', 'url(' + djson.data[0].background + ')');
      if(djson.search) {
        $('.search-query').text(djson.search);
      }

      if(waitResize) {
        var newHeight = $('#header').height();
        headerWrapper.addClass('wrapper-hide');
        headerWrapper.show();

        $('#header')
          .css( {height: oldHeight} )
          .animate({height: newHeight}, 1000, function() {
            $(this).css({height: ''});
          });
      }
      search.init('#header');
    }, 'json');
  };

  function animationEnd() {
    if (animationContent) return false;
    var contentTemplate = template.contentTemplate;

    contentTemplate = templates[contentTemplate]();
    $('#content').html(contentTemplate);

    animationContent = true;
    if (dataPhoto) {
      photo.set(dataPhoto, template.photos.box);
    }
    if (dataAlbum) {
      album.set(dataAlbum, template.album.box);
    }
  }

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

    $('#header .wrapper-hide').remove();
    headerWrapper = $('#header').find('.header__wrapper');
    if (headerWrapper.length > 0) {
      $('#content >*').animate({height: 0, opaciti: 0}, 300, animationEnd);
      headerRender(true, data.data);
    } else {
      animationEnd();
      headerRender(false, data.data);
    }

    var url;
    if (template.photos) {
      url = template.photos.ajax_url + data.data;
      $.post(url, function(djson) {
        dataPhoto = djson;
        if (animationContent) {
          photo.set(djson, template.photos.box);
        }
      }, 'json');
    }

    if (template.album) {
      url = template.album.ajax_url + data.data;
      $.post(url, function(djson) {
        dataAlbum = djson;
        if (animationContent) {
          album.set(djson, template.album.box);
        }
      }, 'json');
    }
    return true;
  };

  return {
    update: update,
    init: init
  };
})();
