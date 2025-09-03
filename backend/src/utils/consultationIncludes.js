const {
  Patient,
  User,
  Doctor,
  Appointment,
  Specialty,
} = require("../db/models");

const appointmentIncludes = [
  {
    model: Patient,
    as: "patient",
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "name",
          "email",
          "phoneNumber",
          "gender",
          "dob",
          "address",
          "age",
          "avatar",
        ],
      },
    ],
  },
  {
    model: Doctor,
    as: "doctor",
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "name",
          "email",
          "phoneNumber",
          "gender",
          "dob",
          "address",
          "age",
          "avatar",
        ],
      },
      {
        model: Specialty,
        as: "specialties",
        through: { attributes: [] }, // Exclude junction table attributes
      },
    ],
  },
];

const consultationIncludes = [
  {
    model: Appointment,
    as: "appointment",
    include: appointmentIncludes,
  },
];

module.exports = { consultationIncludes, appointmentIncludes };
