'use strict';

(function($) {
  var form;
  var fileApi = window.File && window.FileReader && window.FileList && window.Blob ? true : false;
  var defaults = {
    error_class: 'error',
    error_message_param: 'error-text',
    url: location.href,
    method: 'post',
    dataType: 'json',
    onMessage: false,
    onValidateUpdate: false,
    onFileChoose: false,
    onGetAjaxDone: false,
    onGetAjaxFail: false,
    beforeAjax: false,
    errMessage: {
      login: 'Заполните поле логин',
      password: 'Заполните поле пароль',
      name: 'Введите свое имя',
      mail: 'Введите свой email',
      comment: 'Введите ваше сообщение',
      data: 'Введите дату',
      text: 'Введите текст',
      skill: 'Введите технологии',
      image: 'Выберите фаил',
      link: 'Введите ссылку',
      failAjax: 'Ошибка отправки формы'
    }
  };

  function ajaxForm( element, options ) {
    this.form = $( element );
    this.config = $.extend({}, defaults, options);
    form = this;
    this.init();
  }

  ajaxForm.prototype.ajaxDone = function(data) {
    form.form.removeClass('disabled');
    form.form.find('[type=submit]').prop('disabled', false);

    if(form.config.onGetAjaxDone) {
      form.config.onGetAjaxDone(data);
      return false;
    }

    if(data.href) {
      setTimeout('location.hash="";location.pathname="' + data.href + '"', 2000);
    }
    if(data.error) {
      form.resultMessage(data.error, 'error_windows');
    }else if(data.message) {
      form.resultMessage(data.message);
      form.form[0].reset();
    }
  };

  ajaxForm.prototype.ajaxFail = function(data) {
    form.form.removeClass('disabled');
    form.form.find('[type=submit]').prop('disabled', false);

    if(form.config.onGetAjaxFail) {
      form.config.onGetAjaxFail(data);
      return false;
    }
    form.resultMessage(form.config.errMessage.failAjax, 'error_windows');
  };

  ajaxForm.prototype.resultMessage = function(text, className) {
    if(form.config.onMessage) {
      var data = {
        message: text,
        className: className
      };
      form.config.onMessage( data );
      return false;
    }
    var messageWindows = $('<div/>', {
      'class': 'message_windows ' + className
    });
    var closeButton = $('<input/>', {
      value: 'Закрыть',
      type: 'button',
      'class': 'message_windows__button'
    }).on('click', function() {
      $(this).parent().parent().remove();
    });
    var content = $('<div/>', {
      'class': 'message_windows__content',
      text: text
    });
    content.append(closeButton);
    messageWindows.append(content);
    $('body').append(messageWindows);
    messageWindows.addClass('open');
    setTimeout( '$(".message_windows .message_windows__button").click()', 3000);
  };

  ajaxForm.prototype.vlidate = function( block ) {
    if(form.form.hasClass('disabled'))return;
    var $block = $(block);
    var value = $block.val() || $block.text();
    if(value.length < 3) {
      if(form.config.onValidateUpdate) {
        form.config.onValidateUpdate( {block: $block, hasError: true} );
      }else {
        $block.parent().addClass(form.config.error_class);
        $block.parent().attr(form.config.error_message_param, form.config.errMessage[$block.attr('name')]);
      }

      $block
        .off( 'input')
        .off( 'paste')
        .on('input',  function() {
          form.vlidate(this);
        })
        .on('paste',  function() {
          form.vlidate(this);
        });
      return false;
    } else {
      if(form.config.onValidateUpdate) {
        form.config.onValidateUpdate( {block: $block, hasError: false} );
      }else {
        $block.parent().removeClass(form.config.error_class);
      }
      return true;
    }
  };

  ajaxForm.prototype.init = function() {
    var elements = this.form.find('[required]');
    $.each(elements, function() {
      $(this)
        .attr('required', false)
        .addClass('required');
    });
    if(form.config.onFileChoose) {
      this.form.find('[type=file]').on('change', function() {
        var fileName;
        var input = this;
        var $this = $(input);
        if (fileApi && input.files[0]) {
          fileName = input.files[0].name;
        } else {
          fileName = $this.val();
        }

        if (!fileName.length) {
          $this.parent().find('span.file_name').text($this.attr('default_text'));
        } else {
          $this.parent().find('span.file_name').text(fileName);
        }

        if (fileApi && input.files[0]) {
          var file = input.files[0];
          var img = document.createElement('img');
          img.file = file;

          var readerImg = new FileReader();
          readerImg.onload = (function(inputHere) {
            var inputObject = inputHere;
            return function(e) {
              form.config.onFileChoose(e, inputObject);
            };
          })(input);

          readerImg.readAsDataURL(file);
        }
      }).each(function() {
        var $this = $(this);
        $this.attr('default_text', $this.parent().find('span').text());
      });
    }
    this.form
      .on('submit', function(e) {
        e.preventDefault();
        var isValidate = true;
        var $this = $(this);
        elements = $this.find('.required');
        $.each(elements, function() {
          var $element = $(this);
          isValidate = form.vlidate($element) && isValidate;
        });

        if(!isValidate)return;
        var ajaxParametr = {
          url: $this.attr('action') || form.config.url,
          method: $this.attr('method') || form.config.method,
          dataType: $this.attr('dataType') || form.config.dataType
        };
        if($this.find('[type=file]').length > 0) {
          ajaxParametr.data = new FormData($this[0]);
          ajaxParametr.processData = false;
          ajaxParametr.contentType = false;
        }else{
          ajaxParametr.data = JSON.stringify($this.serializeObject());
          ajaxParametr.beforeSend = function(xhr) {
            xhr.setRequestHeader('content-type', 'application/json');
          };
        }
        if(form.config.beforeAjax) {
          ajaxParametr = form.config.beforeAjax(ajaxParametr);
          if(!ajaxParametr) return false;
        }
        form.form.addClass('disabled');
        form.form.find('[type=submit]').prop('disabled', true);
        $.ajax(ajaxParametr)
        .done(form.ajaxDone)
        .fail(form.ajaxFail);
      })
      .on('reset', function(e) {
        var $this = $(this);
        $this.find('.required')
          .off( 'input')
          .off( 'paste')
          .parent().removeClass( form.config.error_class );
      });
  };

  $.fn.ajaxForm = function(options) {
    $(this).each(function() {
      return new ajaxForm(this, options);
    });
    return this;
  };
})(jQuery);

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
