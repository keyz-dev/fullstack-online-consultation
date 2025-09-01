"use strict";

const {
  DoctorAvailability,
  Doctor,
  TimeSlot,
  DoctorSpecialty,
  Specialty,
  User,
} = require("../db/models");
const { Op } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const {
  multipleAvailabilitiesSchema,
  updateAvailabilitySchema,
  invalidationSchema,
} = require("../schema/availabilitySchema");
const timeSlotService = require("../services/timeSlotService");

// ==================== CREATE MULTIPLE AVAILABILITIES ====================
const createAvailabilities = async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    // Validate request body
    const { error, value } = multipleAvailabilitiesSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { availabilities } = value;
    // Validate doctor exists
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Check for time conflicts with existing availabilities
    const existingAvailabilities = await DoctorAvailability.findAll({
      where: {
        doctorId: doctor.id,
        dayOfWeek: { [Op.in]: availabilities.map((av) => av.dayOfWeek) },
        isInvalidated: false,
      },
      attributes: ["dayOfWeek", "startTime", "endTime", "id"],
    });

    // Helper function to check if two time ranges overlap
    const timeOverlaps = (start1, end1, start2, end2) => {
      const startTime1 = new Date(`2000-01-01 ${start1}`);
      const endTime1 = new Date(`2000-01-01 ${end1}`);
      const startTime2 = new Date(`2000-01-01 ${start2}`);
      const endTime2 = new Date(`2000-01-01 ${end2}`);
      
      // Two ranges overlap if: start1 < end2 AND start2 < end1
      return startTime1 < endTime2 && startTime2 < endTime1;
    };

    // Check each new availability against existing ones for time conflicts
    for (const newAvailability of availabilities) {
      const dayExisting = existingAvailabilities.filter(
        (existing) => existing.dayOfWeek === newAvailability.dayOfWeek
      );

      for (const existing of dayExisting) {
        if (timeOverlaps(
          newAvailability.startTime,
          newAvailability.endTime,
          existing.startTime,
          existing.endTime
        )) {
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          throw new ConflictError(
            `Time conflict on ${dayNames[newAvailability.dayOfWeek]}: ${newAvailability.startTime}-${newAvailability.endTime} overlaps with existing session ${existing.startTime}-${existing.endTime}`
          );
        }
      }
    }

    // Validate time conflicts within the request
    const dayGroups = availabilities.reduce((acc, av) => {
      if (!acc[av.dayOfWeek]) acc[av.dayOfWeek] = [];
      acc[av.dayOfWeek].push(av);
      return acc;
    }, {});

    for (const [dayOfWeek, dayAvailabilities] of Object.entries(dayGroups)) {
      if (dayAvailabilities.length > 1) {
        // Check for overlapping times on the same day
        for (let i = 0; i < dayAvailabilities.length; i++) {
          for (let j = i + 1; j < dayAvailabilities.length; j++) {
            const av1 = dayAvailabilities[i];
            const av2 = dayAvailabilities[j];

            const start1 = new Date(`2000-01-01 ${av1.startTime}`);
            const end1 = new Date(`2000-01-01 ${av1.endTime}`);
            const start2 = new Date(`2000-01-01 ${av2.startTime}`);
            const end2 = new Date(`2000-01-01 ${av2.endTime}`);

            if (start1 < end2 && start2 < end1) {
              const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              throw new ConflictError(
                `Overlapping times found for ${dayNames[dayOfWeek]}: ${av1.startTime}-${av1.endTime} and ${av2.startTime}-${av2.endTime}`
              );
            }
          }
        }
      }
    }

    // Create availabilities in a transaction
    const result = await DoctorAvailability.sequelize.transaction(async (t) => {
      const createdAvailabilities = [];

      for (const availabilityData of availabilities) {
        const availability = await DoctorAvailability.create(
          {
            doctorId: doctor.id,
            ...availabilityData,
            isAvailable: true,
            isInvalidated: false,
          },
          { transaction: t }
        );

        createdAvailabilities.push(availability);
      }

      return createdAvailabilities;
    });

    // Generate time slots for newly created availabilities AFTER transaction is committed
    try {
      console.log(`Generating time slots for ${result.length} newly created availabilities`);
      
      // Generate time slots for each newly created availability
      for (const availability of result) {
        try {
          const startDate = new Date();
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 28); // 4 weeks

          await timeSlotService.regenerateSlotsForAvailability(
            availability.id,
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
          );
          
          console.log(`Generated time slots for availability ID: ${availability.id}`);
        } catch (slotError) {
          console.error(`Error generating time slots for availability ${availability.id}:`, slotError);
          // Continue with other availabilities even if one fails
        }
      }
    } catch (slotError) {
      console.error("Error generating time slots:", slotError);
      // Log the error but don't fail the response since availabilities were created successfully
    }

    res.status(201).json({
      status: "success",
      message: `${result.length} availability schedule(s) created successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET ALL AVAILABILITIES FOR DOCTOR ====================
const getAllByDoctor = async (req, res, next) => {
  try {
    const userId = req.authUser.id;
    const { includeInvalidated = false } = req.query;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const whereClause = { doctorId: doctor.id };
    if (!includeInvalidated) {
      whereClause.isInvalidated = false;
    }

    const availabilities = await DoctorAvailability.findAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
      order: [["dayOfWeek", "ASC"]],
    });

    res.json({
      status: "success",
      data: availabilities,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET SPECIFIC AVAILABILITY ====================
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: TimeSlot,
          as: "timeSlots",
          where: {
            date: {
              [Op.gte]: (() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day = String(today.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              })(),
            },
          },
          required: false,
        },
      ],
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    res.json({
      status: "success",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE AVAILABILITY ====================
const updateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Validate request body
    const { error, value } = updateAvailabilitySchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    // Check for conflicts if dayOfWeek is being changed
    if (value.dayOfWeek && value.dayOfWeek !== availability.dayOfWeek) {
      const existingAvailability = await DoctorAvailability.findOne({
        where: {
          doctorId: doctor.id,
          dayOfWeek: value.dayOfWeek,
          isInvalidated: false,
          id: { [Op.ne]: id },
        },
      });

      if (existingAvailability) {
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        throw new ConflictError(
          `Availability already exists for ${dayNames[value.dayOfWeek]}`
        );
      }
    }

    // Update in transaction
    const result = await DoctorAvailability.sequelize.transaction(async (t) => {
      await availability.update(value, { transaction: t });

      // Regenerate time slots if timing-related fields were updated
      const timingFields = ["startTime", "endTime", "consultationDuration"];
      const hasTimingChanges = timingFields.some((field) => value[field]);

      if (hasTimingChanges) {
        try {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 28); // 4 weeks

          // Fix: Use local date formatting to avoid timezone issues
          const formatLocalDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };

          await timeSlotService.regenerateSlotsForAvailability(
            availability.id,
            formatLocalDate(startDate),
            formatLocalDate(endDate)
          );
        } catch (slotError) {
          console.error("Error regenerating time slots:", slotError);
          // Don't fail the transaction if slot regeneration fails
        }
      }

      return availability;
    });

    res.json({
      status: "success",
      message: "Availability updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== INVALIDATE AVAILABILITY ====================
const invalidateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Validate request body
    const { error, value } = invalidationSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    await availability.update({
      isInvalidated: true,
      invalidationReason: value.invalidationReason,
      invalidatedAt: new Date(),
    });

    res.json({
      status: "success",
      message: "Availability invalidated successfully",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE AVAILABILITY ====================
const deleteAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    // Check if there are any booked appointments for this availability
    const bookedSlots = await TimeSlot.count({
      where: { 
        doctorAvailabilityId: id, 
        isBooked: true,
        date: {
          [Op.gte]: new Date().toISOString().split('T')[0] // Only future bookings
        }
      }
    });

    if (bookedSlots > 0) {
      return res.status(409).json({
        status: "error",
        message: "Cannot delete availability with active bookings",
        data: {
          bookedSlots,
          action: "invalidate_required",
          suggestion: "Use invalidate instead to provide a reason to patients"
        }
      });
    }

    // Safe to delete - no active bookings
    await availability.destroy();

    res.json({
      status: "success",
      message: "Availability deleted successfully",
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REACTIVATE AVAILABILITY ====================
const reactivateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    if (!availability.isInvalidated) {
      throw new BadRequestError("Availability is not invalidated");
    }

    await availability.update({
      isInvalidated: false,
      invalidationReason: null,
      invalidatedAt: null,
    });

    res.json({
      status: "success",
      message: "Availability reactivated successfully",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET AVAILABLE DOCTORS (FOR PATIENTS) ====================
const getAvailableDoctors = async (req, res, next) => {
  try {
    const { symptoms, date, consultationType } = req.query;

    if (!date) {
      throw new BadRequestError("Date is required");
    }

    // Parse the date
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestError("Invalid date format");
    }

    const dayOfWeek = targetDate.getDay();

    // Build where clause for availabilities
    const availabilityWhere = {
      dayOfWeek,
      isAvailable: true,
      isInvalidated: false,
    };

    // Add consultation type filter if specified
    if (consultationType) {
      availabilityWhere.consultationType = {
        [Op.or]: [consultationType, "both"],
      };
    }

    const availabilities = await DoctorAvailability.findAll({
      where: availabilityWhere,
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: DoctorSpecialty,
              as: "specialties",
              include: [
                {
                  model: Specialty,
                  as: "specialty",
                },
              ],
            },
          ],
        },
      ],
    });

    // Filter by symptoms if provided
    let filteredAvailabilities = availabilities;
    if (symptoms && symptoms.length > 0) {
      const symptomArray = Array.isArray(symptoms) ? symptoms : [symptoms];
      filteredAvailabilities = availabilities.filter((availability) => {
        const doctorSpecialties = availability.doctor.specialties.map(
          (ds) => ds.specialty.name
        );
        return symptomArray.some((symptom) =>
          doctorSpecialties.includes(symptom)
        );
      });
    }

    res.json({
      status: "success",
      data: filteredAvailabilities,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REGENERATE TIME SLOTS FOR AVAILABILITY ====================
const regenerateTimeSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Find the availability
    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    // Generate time slots for the next 4 weeks
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 28); // 4 weeks

    await timeSlotService.regenerateSlotsForAvailability(
      availability.id,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    res.json({
      status: "success",
      message: "Time slots regenerated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== TEST TIME SLOT GENERATION ====================
const testTimeSlotGeneration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    // Find the doctor associated with the user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Find the availability
    const availability = await DoctorAvailability.findOne({
      where: { id, doctorId: doctor.id },
    });

    if (!availability) {
      throw new NotFoundError("Availability not found");
    }

    console.log(`Testing time slot generation for availability ID: ${availability.id}`);
    console.log(`Availability details: Day ${availability.dayOfWeek}, Time ${availability.startTime}-${availability.endTime}, Duration ${availability.consultationDuration}min`);

    // Generate time slots for the next 4 weeks
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 28); // 4 weeks

    const result = await timeSlotService.regenerateSlotsForAvailability(
      availability.id,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    res.json({
      status: "success",
      message: "Time slot generation test completed",
      data: {
        availabilityId: availability.id,
        slotsGenerated: result.length,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAvailabilities,
  getAllByDoctor,
  getById,
  updateAvailability,
  deleteAvailability,
  invalidateAvailability,
  reactivateAvailability,
  getAvailableDoctors,
  regenerateTimeSlots,
  testTimeSlotGeneration,
};
