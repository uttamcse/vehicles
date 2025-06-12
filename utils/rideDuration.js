function calculateEstimatedRideDuration(fromPincode, toPincode) {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

module.exports = calculateEstimatedRideDuration;