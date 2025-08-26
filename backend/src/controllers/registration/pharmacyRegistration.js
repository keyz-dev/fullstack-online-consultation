const RegistrationService = require("../../services/registrationService");
const { pharmacyRegisterSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { handleFileUploads } = require("../../utils/documentUtil");

// ==================== PHARMACY REGISTRATION (ACID-COMPLIANT) ====================
exports.registerPharmacy = async (req, res, next) => {
  try {
    // Parse form data before validation (similar to vendorApp)
    req.body.address = JSON.parse(req.body.address || "{}");
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "{}");
    req.body.shipping = JSON.parse(req.body.shipping || "{}");
    req.body.languages = JSON.parse(req.body.languages || "[]");
    req.body.paymentMethods = JSON.parse(req.body.paymentMethods || "[]");
    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    const { error } = pharmacyRegisterSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const {
      pharmacyName,
      licenseNumber,
      description,
      address,
      contactInfo,
      shipping,
      paymentMethods,
      languages,
    } = req.body;

    // Handle file uploads (similar to vendorApp)
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    // Prepare data for service
    const pharmacyData = {
      name: pharmacyName,
      licenseNumber,
      description,
      logo: uploadedFiles.logo,
      images: uploadedFiles.images || [],
      documents: uploadedFiles.documents || [],
      languages: languages || [],
      address,
      contactInfo,
      deliveryInfo: shipping || {},
      paymentMethods: paymentMethods || ["cash"],
    };

    // Get user ID from authenticated user
    const userId = req.authUser.id;

    console.log("\n\n Pharmacy Data: \n\n", pharmacyData);

    // Use the registration service
    const result = await RegistrationService.registerPharmacy(
      userId,
      pharmacyData,
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
