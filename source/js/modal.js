'use strict';
var modal = (function() {
  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('.open-modal').on('click', openModal);
    $('.modal-action-close').on('click', closeModal);
  };

  var openModal = function(event) {
    event.preventDefault();
    var modalClass = $(this).data('modal-class');
    $('.' + modalClass).css('display', 'flex');
    $('body').addClass('modal-show');
  };

  var closeModal = function(event) {
    event.preventDefault();
    $('body').removeClass('modal-show');
    $('.modal-overlay').hide();
  };

  return {
    init: init
  };
}());
