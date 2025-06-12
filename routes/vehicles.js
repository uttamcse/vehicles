const express = require('express');
const router = express.Router();
const { addVehicle, getAvailableVehicles } = require('../controllers/vehicleController');

router.post('/vehicles', addVehicle);
router.get('/available', getAvailableVehicles);

module.exports = router;