const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/getImages', imageController.getImages);
router.delete('/deleteImage/:id', imageController.deleteImage);

router.patch('/favimages/:id', imageController.updateFavroutie);

module.exports = router;
