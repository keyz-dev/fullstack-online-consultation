const RegistrationService = require("../../services/registrationService");
const { adminRegisterSchema } = require("../../schema/userSchema");
const { BadRequestError } = require("../../utils/errors");
const { cleanUpFileImages } = require("../../utils/imageCleanup");

// ==================== ADMIN REGISTRATION ====================
exports.registerAdmin = async (req, res, next) => {
  try {
    // Parse form data before validation
    if (req.body.address) {
      req.body.address = JSON.parse(req.body.address);
    }

    const parsedBody = req.body;

    const { error } = adminRegisterSchema.validate(parsedBody);
    if (error) throw new BadRequestError(error.details[0].message);

    let avatar = undefined;
    if (req.file) avatar = req.file.path;

    // Use the registration service
    const result = await RegistrationService.registerAdmin(parsedBody, avatar);

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
