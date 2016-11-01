'use strict';

var modal = (function() {
  var _modalClass = 'modal-overlay';
  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('.open-modal').on('click', _openModal);
    $('.modal-action-close,.modal-overlay').on('click', _closeModal);
    $('.modal').on('click', _stopPropogation);
  };

  var _stopPropogation = function(event) {
    event.stopPropagation();
  };

  var _openModal = function(event) {
    event.preventDefault();
    open($(this).data('modal-class'));
  };

  var open = function(modalClass) {
    _modalClass = modalClass || 'modal-overlay';
    $('.' + _modalClass).css('display', 'flex');
    $('body').addClass('modal-show');
  };

  var _closeModal = function(event) {
    event.preventDefault();
    $('body').removeClass('modal-show');
    $('.' + _modalClass).fadeOut(300);
  };

  return {
    open: open,
    init: init
  };
}());
