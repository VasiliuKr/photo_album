'use strict';

(function() {
  modal.init();
  popup.init();
  if( $('.form-index').length > 0) {
    $('form').ajaxForm({ onMessage: popup.open });
    return;
  }
<<<<<<< HEAD

  headerEditor.init('#header');
  album.init( {showAddModal: modal.add_album, showEditModal: modal.edit_album});
  photo.init( {showAddModal: modal.add_photo, showEditModal: modal.edit_photo});

=======

  headerEditor.init('#header');
  album.init( {showAddModal: modal.add_album});
  photo.init( {showAddModal: modal.add_photo});

/*
  album.init( {showAddModal: modal.add_album, showEditModal: modal.edit_album});
  photo.init( {showAddModal: modal.add_photo, showEditModal: modal.edit_photo});
*/
>>>>>>> origin/master
  urlParser.init( pageTemplate.update );
})();
