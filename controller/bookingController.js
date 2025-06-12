const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const calculateEstimatedRideDuration = require('../utils/rideDuration');

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
    const start = new Date(startTime);
    const duration = calculateEstimatedRideDuration(fromPincode, toPincode);
    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    const overlap = await Booking.findOne({
      vehicleId,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });
    if (overlap) return res.status(409).json({ error: 'Vehicle already booked during this time' });

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
