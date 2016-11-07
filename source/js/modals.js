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

// Функция открытия модального окна
  var modalOpen = function(template) {
    return function(json) {
      close();
      $('body')
        .addClass('modal-show')
        .append(templates[template](json));
      var form = $('.modal-overlay').find('form').eq(0);
      return form || '';
    };
  };

  return {
    add_album: modalOpen('modal_add_album'),
    edit_album: modalOpen('modal_edit_album'),
    add_photo: modalOpen('modal_photo_add'),
    edit_photo: modalOpen('modal_edit_photo'),
    close: close,
    init: init
  };
}());
