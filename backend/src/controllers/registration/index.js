// Export all registration controllers
const adminRegistration = require("./adminRegistration");
const patientRegistration = require("./patientRegistration");
const doctorRegistration = require("./doctorRegistration");
const pharmacyRegistration = require("./pharmacyRegistration");

module.exports = {
  ...adminRegistration,
  ...patientRegistration,
  ...doctorRegistration,
  ...pharmacyRegistration,
};
