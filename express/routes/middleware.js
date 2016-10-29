'use strict';

module.exports=(req, res, next)=> {
  var url=req.url.split('/');
  if(
      !req.session.is_auth &&
      url[1].length!=0 &&
      (url[1]!='ajax' || url[2].indexOf('user_')!==0)
  ){
    res.redirect('/');
  }else{
    next();
  }
};