'use strict';

(function() {
  modal.init();
  popup.init();
  if( $('.form-index').length > 0) {
    $('form').ajaxForm({ onMessage: popup.open });
    return;
  }

  album.init( {showAddModal: modal.add_album, showEditModal: modal.edit_album});
  photo.init( {showAddModal: modal.add_photo, showEditModal: modal.edit_photo});
  urlParser.init( pageTemplate.update );
})();
