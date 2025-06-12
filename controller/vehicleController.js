const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const calculateEstimatedRideDuration = require("../utils/rideDuration");

exports.addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres)
      return res.status(400).json({
    error: "Missing fields" });
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    const start = new Date(startTime);
    const duration = calculateEstimatedRideDuration(fromPincode, toPincode);
    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    const allVehicles = await Vehicle.find({
      capacityKg: { $gte: capacityRequired },
    });
    const bookings = await Booking.find({
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    const bookedIds = bookings.map((b) => b.vehicleId.toString());
    const available = allVehicles.filter(
      (v) => !bookedIds.includes(v._id.toString())
    );
    res
      .status(200)
      .json({ vehicles: available, estimatedRideDurationHours: duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
