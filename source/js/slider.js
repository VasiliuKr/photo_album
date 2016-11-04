'use strict';

var slider = (function() {
  var animations = 'animate-prev animate-next animate-next-current animate-prev-current';

  var init = function() {
    _setUpListeners();
  };

  var openSlider = function() {
    event.preventDefault();
    // Устанавливаем слайд
    open($(this).index());
  };

  var open = function(curSlide) {
    modal.open('modal-slider');
    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);
    setCurrentSlide(curSlide || 0);// индексация с нуля
  };

  var _setUpListeners = function() {
    $('.slider__next').on('click', nextSlide);
    $('.slider__prev').on('click', prevSlide);
    $('.open-slider').on('click', openSlider);
  };
  // имитация подгрузки
  var ajaxGetData = function(from, to) {
    return {};
  };
  // добавление данных в слайдер
  var addData = function(data) {
  };

  var nextSlide = function(event) {
    event.preventDefault();

    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);

    // Получаем текущий слайд
    var curSlide = $('.slider__images-item--current');
    // Анимируем текущий слайд налево
    curSlide.addClass('animate-next-current');

    // Получаем следующий слайд
    var next = curSlide.next();

    // Догрузить данные перед последним
    /* if (next.length && !next.next().length) {
      var data = ajaxGetData(0, 0);
      addData(data);
    }*/

    // если текущий слайд не последний и имеет следующий слайд
    if (next.length) {
      // Анимируем следующий слайд налево
      next.addClass('slider__images-item--current animate-next');
      // Делаем следующий слайд текущим
      setCurrentSlide(next.index());
    }else{
      // Получаем первый слайд
      var first = $('.slider__images-item').eq(0);
      // Анимируем первый слайд налево
      first.addClass('slider__images-item--current animate-next');
      // Делаем первый слайд текущим
      setCurrentSlide(0);
    }
  };

  var prevSlide = function(event) {
    event.preventDefault();

    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);
    // Получаем текущий слайд
    var curSlide = $('.slider__images-item--current');
    // Анимируем текущий слайд направо
    curSlide.addClass('animate-prev-current');

    // Получаем предыдущий слайд
    var prev = curSlide.prev();

    // если текущий слайд не первый и имеет предыдущий слайд
    if (prev.length) {
      // Анимируем предыдущий слайд направо
      prev.addClass('slider__images-item--current animate-prev');
      // Делаем предыдущий слайд текущим
      setCurrentSlide(prev.index());
    }else{
      // Получаем последний слайд
      var last = $('.slider__images-item').last();
      // Анимируем последний слайд направо
      last.addClass('slider__images-item--current animate-prev');
      // Делаем последний слайд текущим
      setCurrentSlide(last.index());
    }
  };

  var setCurrentSlide = function(index) {
    // Устанавливаем текущий слайд по индексу
    $('.slider__images-item')
      .removeClass('slider__images-item--current')
      .eq(index)
      .addClass('slider__images-item--current');

    // Показываем описание в соответствии с индексом
    $('.slider__description-item')
      .removeClass('slider__description-item--current')
      .eq(index)
      .addClass('slider__description-item--current');

    // Анимируем часть слайдера с описанием и комментариями
    $('.slider__description').css('top', $('.slider').height());
  };

  return {
    open: open,
    init: init
  };
}());

