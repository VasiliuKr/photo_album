'use strict';

var photosAdd = ( function() {
  var photos = [];
  var files = [];

  var init = function(form) {
    _setUpListeners(form);
  };

  var _setUpListeners = function(form) {
    $(form).on('change', '#files', handleFiles);
    $(form).on('click', '.add-photo__item-close', removePhoto);
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

