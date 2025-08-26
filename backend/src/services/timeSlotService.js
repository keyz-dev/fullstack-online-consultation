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
        throw new Error("No availability schedules found for this doctor");
      }

      const generatedSlots = [];
      const currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);

      while (currentDate <= endDateTime) {
        const dayOfWeek = currentDate.getDay();
        const dateString = currentDate.toISOString().split("T")[0];

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
      const createdSlots = await TimeSlot.bulkCreate(slots, {
        ignoreDuplicates: true,
      });

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
                attributes: ["id", "name", "email"],
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
   * Regenerate time slots for a specific availability
   */
  async regenerateSlotsForAvailability(availabilityId, startDate, endDate) {
    try {
      // Delete existing slots for this availability in the date range
      await TimeSlot.destroy({
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

      // Generate new slots
      const slots = await this.generateTimeSlots(
        availability.doctorId,
        startDate,
        endDate
      );
      const filteredSlots = slots.filter(
        (slot) => slot.doctorAvailabilityId === availabilityId
      );

      // Create new slots
      const createdSlots = await this.createTimeSlots(filteredSlots);

      return createdSlots;
    } catch (error) {
      console.error("Error regenerating slots:", error);
      throw error;
    }
  }
}

module.exports = new TimeSlotService();
