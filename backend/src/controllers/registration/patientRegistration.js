const RegistrationService = require("../../services/registrationService");
const { patientRegisterSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");

// ==================== PATIENT REGISTRATION ====================
exports.registerPatient = async (req, res, next) => {
  try {
    // Parse form data before validation
    req.body.emergencyContact = JSON.parse(req.body.emergencyContact || "{}");
    req.body.address = JSON.parse(req.body.address || "{}");
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "[]");

    const { error } = patientRegisterSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { emergencyContact, ...userData } = req.body;

    let avatar = undefined;
    if (req.file) avatar = req.file.path;

    // Prepare data for service
    const patientData = {
      emergencyContact,
    };

    // Use the registration service
    const result = await RegistrationService.registerPatient(
      userData,
      patientData,
      avatar
    );

    res.status(201).json({
      status: "success",
      message: result.message,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};
