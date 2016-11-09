'use strict';

var search = (function() {
  function _testSearch(e) {
    e.preventDefault();
    var $this = $(this);
    var value = $this.find('input').val();

    if (value.length < 3) {
      popup.open({message: 'Минимальная длина строки поиска 3 символа. Так же если строка начнется с # то поиск будет осуществлен по хештегу.'});
      return false;
    }
    var searchLine = '/search/?';
    if (value[0] === '#') {
      if ( !/(^#[a-zA-Zа-яА-Я0-9]+)$/.test(value)) {
        popup.open({message: 'При поиске по хештегам можно использовать только буквы и цифры. Поиск осуществляется по одному хештегу.'});
        return false;
      }
      searchLine += 'tag';
      value = value.replace('#', '');
    }else{
      searchLine += 'search';
    }
    searchLine += '=' + value;
    searchLine = encodeURI(searchLine);
    urlParser.goto(searchLine);
  }

  function init(element) {
    var searchItem =  $(element).find('#search');
    searchItem.on('submit',  _testSearch);
  }

  return {
    init: init
  };
}());
