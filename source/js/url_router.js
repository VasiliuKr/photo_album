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
  };

  var _setUpListeners = function() {
    $('body').on('click', 'a', _linkClick);
  };

  var _analyzeUrl = function(url) {
    var urlAnalize = url.replace(location.origin, '');
    if(urlAnalize.indexOf('#') >= 0) {
      urlAnalize = urlAnalize.split( '#' );
      urlAnalize = '/' + urlAnalize[1];
    }
    urlAnalize = urlAnalize.split( '/' );
    var pageData = {
      template: urlAnalize[1] ? urlAnalize[1] : '',
      data: urlAnalize[2] ? urlAnalize[2] : ''
    };

    return pageTemplate(pageData);
  };

  var _linkClick = function(e) {
    var url = this.href;
    if(url.indexOf('#') >= 0 ) {
      e.preventDefault();
      return false;
    }
    if(_analyzeUrl( url )) {
      _setLocation(url);
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
