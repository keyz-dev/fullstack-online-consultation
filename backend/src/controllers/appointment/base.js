const {
  Appointment,
  Payment,
  Patient,
  TimeSlot,
  DoctorAvailability,
  Doctor,
  User,
  Specialty,
  Symptom,
  PatientDocument,
} = require("../../db/models");
const { NotFoundError, UnauthorizedError } = require("../../utils/errors");
const {
  formatAppointmentData,
} = require("../../utils/returnFormats/appointmentData");
const logger = require("../../utils/logger");

const getAppointmentIncludes = (
  includePayment = true,
  includePatient = true
) => [
  {
    model: TimeSlot,
    as: "timeSlot",
    include: [
      {
        model: DoctorAvailability,
        as: "availability",
        include: [
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
                  "avatar",
                  "gender",
                  "phoneNumber",
                  "dob",
                ],
              },
              {
                model: Specialty,
                as: "specialties",
              },
            ],
          },
        ],
      },
    ],
  },
  ...(includePatient
    ? [
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
                "avatar",
                "gender",
                "phoneNumber",
                "dob",
              ],
            },
            {
              model: PatientDocument,
              as: "documents",
            },
          ],
        },
      ]
    : []),
  ...(includePayment
    ? [
        {
          model: Payment,
          as: "payments",
          order: [["createdAt", "DESC"]],
        },
      ]
    : []),
];

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: getAppointmentIncludes(),
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    const formattedAppointment = await formatAppointmentData(appointment, {
      includePayment: true,
      includeDoctor: true,
      includePatient: true,
    });

    res.json({
      success: true,
      data: formattedAppointment,
    });
  } catch (error) {
    logger.error("Error fetching appointment:", error);
    next(error);
  }
};

module.exports = {
  getAppointmentById,
  getAppointmentIncludes,
};
