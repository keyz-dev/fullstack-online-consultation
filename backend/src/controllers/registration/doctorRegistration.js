const RegistrationService = require("../../services/registrationService");
const { doctorRegisterSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { handleFileUploads } = require("../../utils/documentUtil");

// ==================== DOCTOR REGISTRATION (ACID-COMPLIANT) ====================
exports.registerDoctor = async (req, res, next) => {
  try {
    // Parse form data before validation (similar to vendorApp)
    req.body.specialties = JSON.parse(req.body.specialties || "[]");
    req.body.languages = JSON.parse(req.body.languages || "[]");
    req.body.education = JSON.parse(req.body.education || "[]");
    req.body.clinicAddress = JSON.parse(req.body.clinicAddress || "{}");
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "{}");
    req.body.paymentMethods = JSON.parse(req.body.paymentMethods || "[]");
    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    const { error } = doctorRegisterSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const {
      email,
      licenseNumber,
      experience,
      bio,
      education,
      languages,
      specialties,
      clinicAddress,
      operationalHospital,
      contactInfo,
      consultationFee,
      consultationDuration,
      paymentMethods,
      ...userData
    } = parsedBody;

    // Handle file uploads (similar to vendorApp)
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    // Prepare data for service
    const doctorData = {
      licenseNumber,
      experience,
      bio,
      education: education || [],
      languages: languages || [],
      specialties,
      clinicAddress,
      operationalHospital,
      contactInfo,
      consultationFee,
      consultationDuration: consultationDuration || 30,
    };

    // Use the registration service
    const result = await RegistrationService.registerDoctor(
      userData,
      doctorData,
      uploadedFiles
    );

    res.status(201).json({
      status: "success",
      message: result.message,
      data: {
        user: result.user,
        application: result.application,
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};
