const { TimeSlot, DoctorAvailability } = require("../db/models");
const { formatTimeSlotData } = require("../utils/returnFormats/timeSlotData");
const { Op } = require("sequelize");

/**
 * Get available time slots for a specific doctor
 */
const getDoctorTimeSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, consultationType, minFee, maxFee } = req.query;

    // Validate doctor ID
    if (!doctorId || isNaN(parseInt(doctorId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // Build where clause
    const whereClause = {};

    // Add date filter if provided
    if (date) {
      whereClause.date = date;
    } else {
      // If no date provided, get slots for next 7 days
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      whereClause.date = {
        [Op.between]: [
          today.toISOString().split("T")[0],
          nextWeek.toISOString().split("T")[0],
        ],
      };
    }

    // Build availability where clause
    const availabilityWhereClause = { doctorId: parseInt(doctorId) };

    // Add consultation type filter
    if (
      consultationType &&
      ["online", "physical", "both"].includes(consultationType)
    ) {
      availabilityWhereClause.consultationType = consultationType;
    }

    // Add fee range filters
    if (minFee && !isNaN(parseFloat(minFee))) {
      availabilityWhereClause.consultationFee = {
        [Op.gte]: parseFloat(minFee),
      };
    }

    if (maxFee && !isNaN(parseFloat(maxFee))) {
      if (availabilityWhereClause.consultationFee) {
        availabilityWhereClause.consultationFee[Op.lte] = parseFloat(maxFee);
      } else {
        availabilityWhereClause.consultationFee = {
          [Op.lte]: parseFloat(maxFee),
        };
      }
    }

    // Fetch time slots
    const timeSlots = await TimeSlot.findAll({
      where: whereClause,
      include: [
        {
          model: DoctorAvailability,
          as: "availability",
          where: availabilityWhereClause,
          attributes: ["consultationType", "consultationFee"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    // Get current time for filtering past slots
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().split("T")[0];

    // Filter and format time slots
    const formattedTimeSlots = timeSlots
      .map((slot) => ({
        id: slot.id,
        doctorId: slot.doctorId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked,
        consultationType: slot.availability?.consultationType || "both",
        consultationFee: slot.availability?.consultationFee || 0,
        // Add additional properties for frontend filtering
        isPast: slot.date === today && slot.startTime < currentTime,
        isToday: slot.date === today,
        isTomorrow:
          slot.date ===
          new Date(now.getTime() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
      }))
      .filter((slot) => {
        // Filter out past slots on the current day
        if (slot.isPast) {
          return false;
        }
        return true;
      });

    res.json({
      success: true,
      timeSlots: formattedTimeSlots,
      filters: {
        availableDates: [
          ...new Set(formattedTimeSlots.map((slot) => slot.date)),
        ].sort(),
        consultationTypes: [
          ...new Set(formattedTimeSlots.map((slot) => slot.consultationType)),
        ],
        feeRange: {
          min: Math.min(
            ...formattedTimeSlots.map((slot) => slot.consultationFee)
          ),
          max: Math.max(
            ...formattedTimeSlots.map((slot) => slot.consultationFee)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching doctor time slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch time slots",
    });
  }
};

/**
 * Get time slot by ID
 */
const getTimeSlotById = async (req, res) => {
  try {
    const { id } = req.params;

    const timeSlot = await TimeSlot.findByPk(id, {
      include: [
        {
          model: DoctorAvailability,
          as: "availability",
          attributes: ["consultationType", "consultationFee"],
        },
      ],
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    res.json({
      success: true,
      timeSlot: formatTimeSlotData(timeSlot),
    });
  } catch (error) {
    console.error("Error fetching time slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch time slot",
    });
  }
};

module.exports = {
  getDoctorTimeSlots,
  getTimeSlotById,
};
