'use strict';

var myAjaxRequest = (function() {
  var ajaxFail = function() {
    popup.open({message: 'Ошибка отправки на сервер'});
  };

  var sendAjax = function(url, data, ajaxDone) {
    var ajaxParametr = {
      url: url,
      method: 'post',
      dataType: 'json',
      data: JSON.stringify(data),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('content-type', 'application/json');
      }
    };
    $.ajax(ajaxParametr)
      .done(ajaxDone)
      .fail(ajaxFail);
  };

  return {
    send: sendAjax
  };
}());
