'use strict';

var modal = (function() {
  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('body').on('click', '.modal-action-close,.modal-overlay', _closeModal);
    $('body').on('click', '.modal', _stopPropogation);
  };

  var _stopPropogation = function(event) {
    event.stopPropagation();
  };

  var _closeModal = function(event) {
    event.preventDefault();
    close();
  };

  var close = function(clickedElem) {
    $('body').removeClass('modal-show');
    $('.modal-overlay').fadeOut(200, function() { $(this).remove(); });
  };

  var open = function(template) {
    return function(json) {
      close();
      $('body')
        .addClass('modal-show')
        .append(templates[template](json || ''));
      var form = $('.modal-overlay').find('form').eq(0);
      return form || '';
    };
  };

// Добавление альбома
  var modalAlbumAdd = function(json) {
    close();

    $('body')
      .addClass('modal-show')
      .append(templates.modal_add_album(json));

    // albumAdd.init();

    var form = $('.modal-overlay').find('form').eq(0);
    return form || '';
  };

// Добавление фотографий
  var modalPhotoAdd = function(json) {
    close();

    $('body')
      .addClass('modal-show')
      .append(templates.modal_photo_add(json));

    addPhotos.init();

    var form = $('.modal-overlay').find('form').eq(0);
    return form || '';
  };

  return {
    add_album: modalAlbumAdd,
    add_photo: modalPhotoAdd,
    close: close,
    init: init
  };
}());


// Модуль добавления фотографий

var addPhotos = ( function() {
  var photos = [];
  var files = [];

  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('body').on('click', '.add-photo__item-close', removePhoto);
    $('body').on('change', '#files', handleFiles);
  };

  var handleFiles = function() {
    for (var i = 0; i < this.files.length; i++) {
      var file = this.files[i];
      var imageType = /^image\//;

      if (!imageType.test(file.type)) {
        continue;
      }

      getFile(file);
    }
  };

  var getFile = function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var src = e.target.result;
      // Игнорируем повторы
      if ($.inArray( src, photos ) === -1) {
        var photo = $( templates.photo_add({src: src}) );
        photo.attr('title', file.name);
        $('.add-photo__images').append(photo);
        photos.push(src);
        files.push(file);
        updatePhotosInfo();
      }
    };
    reader.readAsDataURL(file);
  };

  var removePhoto = function(event) {
    var photoItem = $(this).closest('.add-photo__item');
    var src = photoItem.find('img').attr('src');
    var i = photos.indexOf(src);
    // Удаление из массива фоток и файлов
    photos.splice(i, 1);
    files.splice(i, 1);

    photoItem.remove();
    updatePhotosInfo();
  };

  var updatePhotosInfo = function() {
    if ( $('.add-photo__item-image').length ) {
      $('.add-photo__info').hide();
    }else{
      $('.add-photo__info').show();
    }
  };

  return {
    init: init,
    files: files
  };
}());

