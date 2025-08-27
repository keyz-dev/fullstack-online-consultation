/**
 * Format a single time slot
 */
const formatTimeSlotData = (timeSlot) => {
  if (!timeSlot) return null;

  return {
    id: timeSlot.id,
    doctorId: timeSlot.doctorId,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    isBooked: timeSlot.isBooked,
    consultationType: timeSlot.availability?.consultationType || "both",
    consultationFee: timeSlot.availability?.consultationFee || 0,
    createdAt: timeSlot.createdAt,
    updatedAt: timeSlot.updatedAt,
  };
};

/**
 * Format multiple time slots
 */
const formatTimeSlotsData = (timeSlots) => {
  if (!Array.isArray(timeSlots)) return [];

  return timeSlots.map(formatTimeSlotData);
};

module.exports = {
  formatTimeSlotData,
  formatTimeSlotsData,
};
