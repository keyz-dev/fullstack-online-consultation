const { TimeSlot, DoctorAvailability } = require("../db/models");
const { formatTimeSlotData } = require("../utils/returnFormats/timeSlotData");

/**
 * Get available time slots for a specific doctor
 */
const getDoctorTimeSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

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
        [require("sequelize").Op.between]: [
          today.toISOString().split("T")[0],
          nextWeek.toISOString().split("T")[0],
        ],
      };
    }

    // Fetch time slots
    const timeSlots = await TimeSlot.findAll({
      where: whereClause,
      include: [
        {
          model: DoctorAvailability,
          as: "availability",
          where: { doctorId: parseInt(doctorId) },
          attributes: ["consultationType", "consultationFee"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    // Format response
    const formattedTimeSlots = timeSlots.map((slot) => ({
      id: slot.id,
      doctorId: slot.doctorId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      consultationType: slot.availability?.consultationType || "both",
      consultationFee: slot.availability?.consultationFee || 0,
    }));

    res.json({
      success: true,
      timeSlots: formattedTimeSlots,
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
