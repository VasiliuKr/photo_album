'use strict';

var urlParser = (function() {
  var pageTemplate;

  var init = function(updateFunction) {
    pageTemplate = updateFunction;
    _setUpListeners();
    var hereUrl = location.href;
    _analyzeUrl(hereUrl);
  };

  var _setUpListeners = function() {
    $('body').on('click', 'a', _linkClick);
  };

  var _analyzeUrl = function(url) {
    var urlSplit = url.split( '/' );
    var pageData = {
      template: urlSplit[3] ? urlSplit[3] : '',
      data: urlSplit[4] ? urlSplit[4] : ''
    };

    return pageTemplate(pageData);
  };

  var _linkClick = function(e) {
    if(_analyzeUrl( this.href )) {
      e.preventDefault();
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
