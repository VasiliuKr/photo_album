'use strict';

var popup = (function() {
  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('body').on('click', '.popup-action-close,.popup-overlay', _closePopup);
    $('body').on('click', '.popup', _stopPropogation);
  };

  var _stopPropogation = function(event) {
    event.stopPropagation();
  };

  var _closePopup = function(event) {
    event.preventDefault();
    close();
  };

  var close = function(clickedElem) {
    $('body').removeClass('popup-show');
    $('.popup-overlay').fadeOut(200, function() { $(this).remove(); });
  };

  var open = function(template) {
    return function(json) {
      close();
      $('body')
        .addClass('popup-show')
        .append(templates[template](json));
    };
  };

  return {
    open: open('popup'),
    close: close,
    init: init
  };
}());
