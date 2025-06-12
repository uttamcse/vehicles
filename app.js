const express = require('express');
const cors = require('cors');
const app = express();
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');

app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;