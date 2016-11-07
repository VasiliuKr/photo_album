'use strict';

var photosAdd = ( function() {
  var files;
  var photos;
  var bigPhotos;

  var init = function(form) {
    files = [];
    photos = [];
    bigPhotos = [];

    _setUpListeners(form);
  };

  var _setUpListeners = function(form) {
    $(form).on('change', '#files', chooseFiles);
    $(form).on('click', '.add-photo__item-close', removePhoto);

    var dropbox = $(form).find('.add-photo__area').get(0);
    dropbox.addEventListener('dragleave', dragleave, false);
    dropbox.addEventListener('dragenter', dragenter, false);
    dropbox.addEventListener('dragover', dragover, false);
    dropbox.addEventListener('drop', _drop, false);
  };

  var chooseFiles = function(e) {
    handleFiles(this.files);
  };

  var dragenter = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  var dragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.add-photo__area').addClass('add-photo__area--dropenter');
  };

  var dragleave = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.add-photo__area').removeClass('add-photo__area--dropenter');
  };

  var _drop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.add-photo__area').removeClass('add-photo__area--dropenter');

    var dt = e.dataTransfer;
    var droppedFiles = dt.files;
    handleFiles(droppedFiles);
  };

  var handleFiles = function(hFiles) {
    for (var i = 0; i < hFiles.length; i++) {
      var file = hFiles[i];
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
      if ($.inArray( src, photos ) === -1 &&
          $.inArray( src, bigPhotos ) === -1) {
        var photo = $( templates.photo_add({src: src}) );
        photo.attr('title', file.name);

        if (file.size > 1024 * 1024) {
          $('.add-photo__big-images').append(photo);
          bigPhotos.push(src);
        }else{
          $('.add-photo__images').append(photo);
          photos.push(src);
          files.push(file);
        }
        updatePhotosInfo();
      }
    };
    reader.readAsDataURL(file);
  };

  var removePhoto = function(event) {
    var photoItem = $(this).closest('.add-photo__item');
    var src = photoItem.find('img').attr('src');
    var i = photos.indexOf(src);

    var photoClass = photoItem.parent().attr('class');
    // Удаление из массива фоток и файлов
    if (photoClass === 'add-photo__images') {
      photos.splice(i, 1);
      files.splice(i, 1);
    }else{
      bigPhotos.splice(i, 1);
    }
    photoItem.remove();
    updatePhotosInfo();
  };

  var updatePhotosInfo = function() {
    if ( $('.add-photo__images .add-photo__item').length ) {
      $('.add-photo__info').hide();
    }else{
      $('.add-photo__info').show();
    }

    if ( $('.add-photo__big-images-wrapper .add-photo__item').length ) {
      $('.add-photo__big-images-wrapper').css('display', 'flex');
    }else{
      $('.add-photo__big-images-wrapper').hide();
    }
  };

  return {
    init: init,
    files: files
  };
}());

