'use strict';

module.exports=(req,res,next)=>{
  /*if(!req.session.is_auth){
    res.redirect('/')
  }else{
    next();
  }*/
  next();
};