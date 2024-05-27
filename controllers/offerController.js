const model = require('../models/offer');
const Vinyl = require('../models/vinyls');
const User = require('../models/user');


exports.makeOffer = (req, res, next) => {
  const id = req.params.id;

  // If user is not logged in, redirect to login page
  if (!req.session.user) {
    return res.redirect('/users/login');
  }

  // Process the offer
  let offer = new model(req.body);
      offer.user = req.session.user;
      offer.vinyl = req.params.id;

    offer.save()
    .then(() => {
      // Update the item document
      return Vinyl.findByIdAndUpdate(id, {
        $inc: { totalOffers: 1 },
        $max: { highestOffer: req.body.amount }
      }, { new: true });
    })
    .then((updatedItem) => {
      req.flash('success', 'Offer made successfully');
      res.redirect('/vinyls/' + id);
      console.log(offer)
    })
    .catch(err => next(err));
};


exports.viewOffers = async (req, res, next) => {
  const vinylId = req.params.id; // get the vinyl ID from the route parameter

  if (!req.session.user) {
      return res.redirect('/users/login');
  }

  try {
      const vinyl = await Vinyl.findById(vinylId);
      if (!vinyl) {
          let err = new Error('Vinyl not found');
          err.status = 404;
          throw err;
      }

      if (!vinyl.seller.equals(req.session.user)) {
          return res.status(401).render('error', { error: 'Unauthorized' });
      }

      const offers = await model.find({ vinyl: vinylId }).populate('user');
      res.render('offers/offers', { offers, vinyl, itemTitle: vinyl.title, itemActive: vinyl.active }); // assuming the view is under views/offers/offers.ejs
  } catch (err) {
      next(err);
  }
};


exports.acceptOffer = (req, res, next) => {
  const vinylId = req.params.id;
  const offerId = req.params.offerId;

  if (!req.session.user) {
    return res.redirect('/users/login');
  }

  Vinyl.findById(vinylId)
    .then(vinyl => {
      if (!vinyl) {
        let err = new Error('Vinyl not found');
        err.status = 404;
        throw err;
      }

      if (!vinyl.seller.equals(req.session.user)) {
        let err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      }

      // Update all offers: set one to accepted and others to rejected
      return model.updateMany({ vinyl: vinylId }, { status: 'rejected' })
        .then(() => {
          return model.findByIdAndUpdate(offerId, { status: 'accepted' });
        })
        .then(() => {
          vinyl.active = false;
          return vinyl.save();
        });
    })
    .then(() => {
      res.redirect(`/vinyls/${vinylId}/offers`);
    })
    .catch(err => next(err));
};
