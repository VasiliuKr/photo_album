'use strict';

var modal = (function() {
  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
   // $('.photo-albums__item-cover-wrapper').on('click', slider);
    $('.my-albums-button_add').on('click', add_album);

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

  var close = function() {
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

  var addAlbum = open('modal_add_album');
  var addPhoto = open('modal_photo_add');
  var popup = open('popup');

  return {
    add_album: addAlbum,
    add_photo: addPhoto,
    popup: popup,
    close: close,
    init: init
  };
}());
