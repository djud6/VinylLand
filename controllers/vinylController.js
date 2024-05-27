const model = require('../models/vinyls');

exports.vinyls = (req, res, next) =>{
    model.find()
    .then(vinyls=>res.render('./vinyl/index', {vinyls}))
    .catch(err=>next(err));
    
};

exports.new = (req, res, next) =>{
    res.render('./vinyl/new');
};

exports.create = (req, res, next) => {
    if (!req.file) {
      // Handle the case when no file is uploaded
      return res.status(400).send('No file was uploaded.');
    }
  
    const image = req.file.filename;
    req.body.image = image;
    console.log(image);
    let vinyl = new model(req.body);
    vinyl.seller = req.session.user;
    vinyl.save()
      .then((vinyl) => {
        console.log(vinyl);
        res.redirect('/vinyls');
      })
      .catch(err => {
        if (err.name === 'ValidationError') {
          err.status = 400;
        }
        next(err);
      });
  };

  exports.show = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      let err = new Error('Invalid vinyl ID');
      err.status = 400;
      return next(err);
    }
  
    model.findById(id)
      .populate('seller')
      .then(vinyl => {
        if (vinyl) {
          const isOwner = req.session.user && vinyl.seller._id.equals(req.session.user);
          return res.render('./vinyl/show', { vinyl, isOwner });
        } else {
          let err = new Error('Cannot find vinyl with id ' + id);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => next(err));
  };

exports.edit = (req, res, next) => {
    let id = req.params.id;
  
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      let err = new Error('Invalid vinyl ID');
      err.status = 400;
      return next(err);
    }
  
    model.findById(id).populate('image')
      .then(vinyl => {
        if (vinyl) {
          return res.render('./vinyl/edit', { vinyl });
        } else {
          let err = new Error('Cannot find vinyl with id' + id);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => next(err));
  };

  exports.update = (req, res, next) => {
    const id = req.params.id;
  
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const err = new Error('Invalid vinyl ID');
      err.status = 400;
      return next(err);
    }
  
    model.findById(id)
      .then(vinyl => {
        if (!vinyl) {
          const err = new Error('Cannot find vinyl with id ' + id);
          err.status = 404;
          return next(err);
        }
  
        // Update fields from req.body
        vinyl.title = req.body.title || vinyl.title;
        vinyl.artist = req.body.artist || vinyl.artist;
        vinyl.seller = req.body.seller || vinyl.seller;
        vinyl.details = req.body.details || vinyl.details;
        vinyl.condition = req.body.condition || vinyl.condition;
        vinyl.price = req.body.price || vinyl.price;
        vinyl.totalOffers = req.body.totalOffers || vinyl.totalOffers;
        vinyl.active = req.body.active || vinyl.active;
  
        // Check if a new file was uploaded
        if (req.file) {
          vinyl.image = req.file.filename;
        }
  
        return vinyl.save();
      })
      .then(updatedVinyl => {
        res.redirect('/vinyls/' + id);
      })
      .catch(err => {
        if (err.name === 'ValidationError') {
          err.status = 400;
        }
        next(err);
      });
  };

  exports.delete = (req, res, next) => {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid vinyl ID');
        err.status = 400;
        return next(err);
    }

    // Start by deleting the vinyl
    model.findByIdAndDelete(id)
    .then(vinyl => {
        if (!vinyl) {
            let err = new Error('Cannot find vinyl with id ' + id);
            err.status = 404;
            return next(err);
        }

        // If the vinyl is found and deleted, proceed to delete all associated offers
        const OfferModel = require('../models/offer'); // Make sure the path to your offer model is correct
        return OfferModel.deleteMany({ vinyl: id });
    })
    .then(() => {
        res.redirect('/vinyls/');
    })
    .catch(err => {
        next(err);
    });
};

exports.search = (req, res, next) => {
    const searchTerm = req.query.q || ''; // Get the search term from the query string
  
    // Your existing search function
    const query = {};
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { title: { $regex: regex } },
        { details: { $regex: regex } },
        { artist: { $regex: regex } }
      ];
    }
  
    model.find(query)
      .then(vinyls => {
        res.render('./vinyl/index', { vinyls, searchTerm }); // Pass the searchTerm to the view
      })
      .catch(err => next(err));
  };

  exports.about = (req, res) =>{
    res.render('about');
};

exports.contact = (req, res) =>{
    res.render('contact');
};