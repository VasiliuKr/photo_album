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
    if(data.href) {
      setTimeout('location.hash="";location.pathname="'+data.href+'"',2000);
    }
    if(data.error){
      form.resultMessage(data.error,'error_windows')
    }else if(data.message){
      form.resultMessage(data.message);
      form.form[0].reset()
    }
    form.form.removeClass('disabled');
    form.form.find('[type=submit]').prop('disabled',false);
  };

  ajaxForm.prototype.ajaxFail = function(data) {
    form.resultMessage(form.config.errMessage.failAjax,'error_windows');
    form.form.removeClass('disabled');
    form.form.find('[type=submit]').prop('disabled',false);
  };

  ajaxForm.prototype.resultMessage = function(text,className) {
    var message_windows=$('<div/>',{
      class:'message_windows '+className
    });
    var close_btn=$('<input/>',{
      value:'Закрыть',
      type:'button',
      class:'message_windows__button'
    }).on('click',function(){
      $(this).parent().parent().remove()
    });
    var content=$('<div/>',{
      class:'message_windows__content',
      text:text
    });
    content.append(close_btn);
    message_windows.append(content);
    $('body').append(message_windows);
    message_windows.addClass('open');
    setTimeout('$(".message_windows .message_windows__button").click()',3000)
  };

  ajaxForm.prototype.vlidate=function(element){
    if(form.form.hasClass('disabled'))return;
    element=$(element);
    if(element.val().length<3){
      element.parent().addClass(form.config.error_class);
      element.parent().attr(form.config.error_message_param,form.config.errMessage[element.attr('name')]);
      element
        .off( "input")
        .off( "paste")
        .on('input',  function() {
          form.vlidate(this)
        })
        .on('paste',  function() {
          form.vlidate(this)
        });
      return false;
    }else {
      element.parent().removeClass(form.config.error_class);
      return true;
    }
  };

  ajaxForm.prototype.init=function(){
    var elements=this.form.find('[required]');
    $.each(elements,function(){
      $(this)
        .attr('required',false)
        .addClass('required');
    });
    this.form.find('[type=file]').on('change',function(){
      var file_name;
      var input=this;
      var $this=$(input);
      if( fileApi && input.files[0] )
        file_name = input.files[ 0].name;
      else
        file_name = $this.val();

      if(!file_name.length){
        $this.parent().find('span').text($this.attr('default_text'))
      }else{
        $this.parent().find('span').text(file_name)
      }
    }).each(function(){
      $this=$(this);
      $this.attr('default_text',$this.parent().find('span').text())
    });
    this.form
      .on('submit',function(e){
        e.preventDefault();
        var is_validate=true;
        $this=$(this);
        elements=$this.find('.required');
        $.each(elements,function(){
          var $this=$(this);
          is_validate=form.vlidate($this) && is_validate;
        });

        if(!is_validate)return;
        form.form.addClass('disabled');
        form.form.find('[type=submit]').prop('disabled',true);
        var ajax_parametr={
          url: $this.attr('action')||form.config.url,
          method:$this.attr('method')||form.config.method,
          dataType:$this.attr('dataType')||form.config.dataType
        };
        if($this.find('[type=file]').length>0){
          ajax_parametr['data']=new FormData($this[0]);
          ajax_parametr['processData']=false;
          ajax_parametr['contentType']=false;
        }else{
          ajax_parametr['data']=JSON.stringify($this.serializeObject());
          ajax_parametr['beforeSend']= function (xhr) {
            xhr.setRequestHeader('content-type', 'application/json');
          }
        }
          $.ajax(ajax_parametr)
          .done(form.ajaxDone)
          .fail(form.ajaxFail);
      })
      .on('reset',function(e){
        $this=$(this);
        $this.find('.required')
          .off( "input")
          .off( "paste")
          .parent().removeClass(form.config.error_class)
      })
  };

  $.fn.ajaxForm=function(options){
    $(this).each(function(){
      new ajaxForm(this,options);
    });
    return this;
  }

})(jQuery);

$.fn.serializeObject = function()
{
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

$('form').ajaxForm();