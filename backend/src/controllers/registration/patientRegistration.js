const RegistrationService = require("../../services/registrationService");
const { patientRegisterSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { handleFileUploads } = require("../../utils/documentUtil");

// ==================== PATIENT REGISTRATION ====================
exports.registerPatient = async (req, res, next) => {
  try {
    // Parse form data before validation
    req.body.emergencyContact = JSON.parse(req.body.emergencyContact || "{}");
    req.body.address = JSON.parse(req.body.address || "{}");
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "[]");
    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    const { error } = patientRegisterSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { emergencyContact, ...userData } = req.body;

    // Handle file uploads
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    let avatar = undefined;
    if (uploadedFiles.avatar) avatar = uploadedFiles.avatar;

    // Prepare data for service
    const patientData = {
      emergencyContact,
      documents: uploadedFiles.documents || [],
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
