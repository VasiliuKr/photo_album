'use strict';

var urlParser = (function() {
  var pageTemplate;

  function _setLocation(curLoc) {
    try {
      history.pushState(null, null, curLoc);
      return;
    } catch(e) {
      location.hash = '#' + curLoc;
    }
  }

  var _scrollTop = function() {
    $('html, body').stop().animate({scrollTop:0}, '500');
  };

  var _onpopstate = function( e ) {
    var url;
    if (history.location === undefined) {
      url = location.href;
    } else {
      url = history.location;
    }
    _analyzeUrl(url);
  };

  var init = function(updateFunction) {
    window.onpopstate = _onpopstate;
    pageTemplate = updateFunction;
    _setUpListeners();
    var hereUrl = location.href;
    _analyzeUrl(hereUrl);
    $('.to-top').on('click',_scrollTop)
  };

  var _setUpListeners = function() {
    $('body').on('click', 'a', _linkClick);
  };

  var _analyzeUrl = function(url) {
    var urlAnalize = url.replace(location.origin, '');

    if(urlAnalize[urlAnalize.length-1] === '#'){
      urlAnalize = urlAnalize.slice(0,-1);
    }

    var getParam = '';
    if(urlAnalize.indexOf('?') >= 0) {
      urlAnalize = urlAnalize.split( '?' );
      getParam = '?' + urlAnalize[1];
      urlAnalize = urlAnalize[0];
    }

    if(urlAnalize.indexOf('#') >= 0) {
      urlAnalize = urlAnalize.split( '#' );
      urlAnalize = '/' + urlAnalize[1];
    }
    urlAnalize = urlAnalize.split( '/' );
    var pageData = {
      template: urlAnalize[1] ? urlAnalize[1] : '',
      data: (urlAnalize[2] ? urlAnalize[2] : '') + getParam
    };

    return pageTemplate(pageData);
  };

  var _linkClick = function(e) {
    var url = this.href;
    if(url.indexOf('#') >= 0 ) {
      return true;
    }
    if(_analyzeUrl( url )) {
      _setLocation(url);
      e.preventDefault();
    }
  };

  var goToUrl = function(url) {
    _setLocation(url);
    return _analyzeUrl(url);
  };

  return {
    goto: goToUrl,
    init: init
  };
}());
