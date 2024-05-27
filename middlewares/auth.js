const Vinyl = require('../models/vinyls');

exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else {
         req.flash('error', 'You are logged in already');
         return res.redirect('/users/profile');
     }
};

exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next();
    }else {
         req.flash('error', 'You need to log in first');
         return res.redirect('/users/login');
     }
};

exports.isSeller = (req, res, next) =>{
    let id = req.params.id;
    Vinyl.findById(id)
    .then(vinyl=>{
        if(vinyl) {
            if(vinyl.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a vinyl with id ' + req.params.id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};

//check if user is not a host
exports.isNotSeller = (req, res, next) => {
    let id = req.params.id;
    Vinyl.findById(id)
      .then(vinyl=>{
          if(vinyl){
              if(vinyl.seller != req.session.user){
                console.log('Not Seller');
                  return next();
              }else{
                  let err = new Error('Unauthorized to access the resource');
                  err.status = 401;
                  return next(err);
              }
          } else {
              let err = new Error('Cannot find Vinyl with id '+id);
              err.status = 404;
              next(err);
          }
      })
  
      .catch(err => next(err));
  };
  
  //check for valid vinyl Id
  exports.isInValid = (req, res, next)=>{
      let id = req.params.id;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          let err = new Error('Invalid connection ID');
          err.status = 400;
          return next(err);
      }
      next();
  };
  
