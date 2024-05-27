const express = require('express');
const offerRoutes = require('./offerRoutes')
const controller = require('../controllers/vinylController');
const offerController = require('../controllers/offerController');
const {isLoggedIn, isSeller, isNotSeller} = require('../middlewares/auth');
const{isInValid} = require('../middlewares/auth');
const router = express.Router();

//Multer for image storage
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/'); // Define the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext); // Rename the uploaded file with a unique name (timestamp)
    },
  });

const upload = multer({ storage });

// Get /connections: send all vinyls to the user
router.get('/', controller.vinyls);

//Get serch results
router.get('/search', controller.search);

// Get /connections/new: send HTML form for creating a new connection
router.get('/new', isLoggedIn, controller.new);

router.get('/about', controller.about);

router.get('/contact', controller.contact);


// GET /connections/:id: send details of connection identified by id
router.get('/:id', isInValid, controller.show);

// POST /connections: create a new connection with image upload
router.post('/', isLoggedIn, upload.single('image'), controller.create);

// GET /connections/:id/edit: send HTML form for editing an existing connection
router.get('/:id/edit', isInValid, isLoggedIn, isSeller,  upload.single('image'), controller.edit);

// PUT /connections/:id: update connection with id
router.put('/:id', isLoggedIn, isSeller, upload.single('image'), controller.update);

// Delete /connections/:id: delete connection identified by id
router.delete('/:id', isLoggedIn, isSeller, controller.delete);

router.post('/:id/offers', isLoggedIn, offerController.makeOffer);

router.patch('/:id/offers/:offerId/accept', offerController.acceptOffer);

router.get('/:id/offers', isLoggedIn, isSeller, offerController.viewOffers);

router.use('/:id/offers', offerRoutes);

module.exports = router;