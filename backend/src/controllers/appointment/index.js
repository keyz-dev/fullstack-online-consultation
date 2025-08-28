const patientAppointments = require("./patient");
const doctorAppointments = require("./doctor");
const baseAppointment = require("./base");

module.exports = {
  ...patientAppointments,
  ...doctorAppointments,
  ...baseAppointment,
};
