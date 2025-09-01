"use strict";

const { DoctorAvailability, TimeSlot } = require("../db/models");
const { Op } = require("sequelize");

class TimeSlotService {
  /**
   * Generate time slots for a specific date range based on doctor availability
   */
  async generateTimeSlots(doctorId, startDate, endDate) {
    try {
      const availabilities = await DoctorAvailability.findAll({
        where: {
          doctorId,
          isAvailable: true,
          isInvalidated: false,
        },
      });

      if (availabilities.length === 0) {
        console.error(
          `No availability schedules found for doctor ID: ${doctorId}`
        );
        throw new Error("No availability schedules found for this doctor");
      }

      const generatedSlots = [];
      const currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);

      while (currentDate <= endDateTime) {
        const dayOfWeek = currentDate.getDay();

        // Fix: Use local date formatting instead of toISOString() to avoid timezone issues
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // Find availability for this day of week
        const availability = availabilities.find(
          (av) => av.dayOfWeek === dayOfWeek
        );

        if (availability) {
          const slots = this.generateSlotsForDay(availability, dateString);
          generatedSlots.push(...slots);
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return generatedSlots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      throw error;
    }
  }

  /**
   * Generate time slots for a specific day based on availability
   */
  generateSlotsForDay(availability, dateString) {
    const slots = [];
    const startTime = new Date(`2000-01-01 ${availability.startTime}`);
    const endTime = new Date(`2000-01-01 ${availability.endTime}`);
    const duration = availability.consultationDuration || 30; // Default 30 minutes

    console.log(`Generating slots for ${dateString}: ${availability.startTime}-${availability.endTime}, duration: ${duration}min`);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      if (slotEnd <= endTime) {
        slots.push({
          doctorAvailabilityId: availability.id,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: slotEnd.toTimeString().slice(0, 5),
          date: dateString,
          isBooked: false,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }

  /**
   * Create time slots in the database
   */
  async createTimeSlots(slots) {
    try {
      console.log(`Attempting to create ${slots.length} time slots in database`);
      
      if (slots.length === 0) {
        console.log('No slots to create');
        return [];
      }
      
      const createdSlots = await TimeSlot.bulkCreate(slots, {
        ignoreDuplicates: true,
      });

      console.log(`Successfully created ${createdSlots.length} time slots in database`);
      return createdSlots;
    } catch (error) {
      console.error("Error creating time slots:", error);
      throw error;
    }
  }

  /**
   * Generate and create time slots for the next N weeks
   */
  async generateWeeklySlots(doctorId, weeks = 4) {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + weeks * 7);

      const slots = await this.generateTimeSlots(doctorId, startDate, endDate);

      const createdSlots = await this.createTimeSlots(slots);

      return createdSlots;
    } catch (error) {
      console.error("Error generating weekly slots:", error);
      throw error;
    }
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(doctorId, date) {
    try {
      const dayOfWeek = new Date(date).getDay();

      const availability = await DoctorAvailability.findOne({
        where: {
          doctorId,
          dayOfWeek,
          isAvailable: true,
          isInvalidated: false,
        },
      });

      if (!availability) {
        return [];
      }

      const timeSlots = await TimeSlot.findAll({
        where: {
          doctorAvailabilityId: availability.id,
          date,
          isBooked: false,
        },
        order: [["startTime", "ASC"]],
      });

      return timeSlots;
    } catch (error) {
      console.error("Error getting available slots:", error);
      throw error;
    }
  }

  /**
   * Get available time slots for a date range
   */
  async getAvailableSlotsForRange(doctorId, startDate, endDate) {
    try {
      const availabilities = await DoctorAvailability.findAll({
        where: {
          doctorId,
          isAvailable: true,
          isInvalidated: false,
        },
      });

      const availabilityIds = availabilities.map((av) => av.id);

      const timeSlots = await TimeSlot.findAll({
        where: {
          doctorAvailabilityId: {
            [Op.in]: availabilityIds,
          },
          date: {
            [Op.between]: [startDate, endDate],
          },
          isBooked: false,
        },
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
                    model: require("../db/models").User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["date", "ASC"],
          ["startTime", "ASC"],
        ],
      });

      return timeSlots;
    } catch (error) {
      console.error("Error getting available slots for range:", error);
      throw error;
    }
  }

  /**
   * Clean up old time slots (past dates)
   */
  async cleanupOldSlots() {
    try {
      const today = new Date().toISOString().split("T")[0];

      const deletedCount = await TimeSlot.destroy({
        where: {
          date: {
            [Op.lt]: today,
          },
        },
      });

      return deletedCount;
    } catch (error) {
      console.error("Error cleaning up old slots:", error);
      throw error;
    }
  }

  /**
   * Generate time slots for a specific availability only
   */
  async generateTimeSlotsForAvailability(availabilityId, startDate, endDate) {
    try {
      // Get the specific availability
      const availability = await DoctorAvailability.findByPk(availabilityId);
      if (!availability) {
        throw new Error("Availability not found");
      }

      const generatedSlots = [];
      const currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);

      while (currentDate <= endDateTime) {
        const dayOfWeek = currentDate.getDay();

        // Fix: Use local date formatting instead of toISOString() to avoid timezone issues
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // Only generate slots if this day matches the availability's day of week
        if (availability.dayOfWeek === dayOfWeek) {
          const slots = this.generateSlotsForDay(availability, dateString);
          generatedSlots.push(...slots);
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return generatedSlots;
    } catch (error) {
      console.error("Error generating time slots for availability:", error);
      throw error;
    }
  }

  /**
   * Regenerate time slots for a specific availability
   */
  async regenerateSlotsForAvailability(availabilityId, startDate, endDate) {
    try {
      
      // Delete existing slots for this availability in the date range
      const deletedCount = await TimeSlot.destroy({
        where: {
          doctorAvailabilityId: availabilityId,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
      

      // Get the availability
      const availability = await DoctorAvailability.findByPk(availabilityId);
      if (!availability) {
        throw new Error("Availability not found");
      }
      

      // Generate new slots for this specific availability only
      const slots = await this.generateTimeSlotsForAvailability(
        availabilityId,
        startDate,
        endDate
      );
      

      // Create new slots
      const createdSlots = await this.createTimeSlots(slots);
      return createdSlots;
    } catch (error) {
      console.error("Error regenerating slots:", error);
      throw error;
    }
  }
}

module.exports = new TimeSlotService();
