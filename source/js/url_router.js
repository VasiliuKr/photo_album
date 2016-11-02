'use strict';

var urlParser = (function() {
  var pageTemplate;

  var init = function(updateFunction) {
    pageTemplate = updateFunction;
    _setUpListeners();
    var hereUrl = location.pathname;
    _analyzeUrl(hereUrl);
  };

  var _setUpListeners = function() {
    $('body').on('click', 'a', _linkClick);
  };

  var _analyzeUrl = function(url) {
    var urlSplit = url.split( '/' );
    var pageData = {
      template: urlSplit[1] ? urlSplit[1] : '',
      data: urlSplit[2] ? urlSplit[2] : ''
    };

    return pageTemplate(pageData);
  };

  var _linkClick = function(e) {
    if(_analyzeUrl( this.href )) {
      event.stopPropagation();
    }
  };

  var goToUrl = function(url) {
    return _analyzeUrl(url);
  };

  return {
    makeUrl: goToUrl,
    init: init
  };
}());
