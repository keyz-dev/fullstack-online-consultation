const RegistrationService = require("../../services/registrationService");
const { initiateRegistrationSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");

// ==================== INITIATE REGISTRATION (BASIC USER INFO) ====================
exports.initiateRegistration = async (req, res, next) => {
  const { role } = req.params;
  const userRole = role.toLowerCase();

  if (!userRole || (userRole !== "doctor" && userRole !== "pharmacy")) {
    throw new BadRequestError("Invalid role. Must be 'doctor' or 'pharmacy'");
  }

  try {
    // Handle file uploads for avatar only
    let avatar = null;
    if (req.file) {
      avatar = req.file.path;
    }

    if (req.body.address) {
      req.body.address = JSON.parse(req.body.address);
    }

    const { error } = initiateRegistrationSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    // Use the registration service to create incomplete user
    const result = await RegistrationService.initiateRegistration(
      req.body,
      avatar,
      userRole
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
