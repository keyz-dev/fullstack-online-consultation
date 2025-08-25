// Export all registration controllers
const adminRegistration = require("./adminRegistration");
const patientRegistration = require("./patientRegistration");
const doctorRegistration = require("./doctorRegistration");
const pharmacyRegistration = require("./pharmacyRegistration");
const initiateRegistration = require("./initiateRegistration");

module.exports = {
  ...adminRegistration,
  ...patientRegistration,
  ...doctorRegistration,
  ...pharmacyRegistration,
  ...initiateRegistration,
};
