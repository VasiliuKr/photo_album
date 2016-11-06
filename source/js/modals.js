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
