'use strict';

module.exports=(req, res, next)=> {
  var url=req.url.split('/');
  if(
      !req.session.isAuth &&
      url[1].length!=0 &&
      (url[1]!='ajax' || url[2]!=('autorisation'))
  ){
    res.redirect('/');
  }else if(
    req.session.isAuth &&
    url[1].length==0
  ){
    res.redirect('/main');
  }else{
    next();
  }
};