const { User, Patient, Doctor, Pharmacy } = require("../db/models");
const {
  adminRegisterSchema,
  patientRegisterSchema,
  doctorRegisterSchema,
  pharmacyRegisterSchema,
} = require("../schema/userSchema");
const { BadRequestError, ConflictError } = require("../utils/errors");
const { handleFileUploads } = require("../utils/documentUtil");
const { cleanUpFileImages } = require("../utils/imageCleanup");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const {
  parseAdminRegistration,
  parsePatientRegistration,
  parseDoctorRegistration,
  parsePharmacyRegistration,
  parseDocumentNames,
} = require("../utils/formParser");

// ==================== ADMIN REGISTRATION ====================
exports.registerAdmin = async (req, res, next) => {
  try {
    // Parse form data before validation
    const parsedBody = parseAdminRegistration(req.body);

    const { error } = adminRegisterSchema.validate(parsedBody);
    if (error) throw new BadRequestError(error.details[0].message);

    const { email, ...userData } = parsedBody;
    let user = await User.findOne({ where: { email } });
    if (user)
      return next(new ConflictError("User already exists with this email"));

    let avatar = undefined;
    if (req.file) avatar = req.file.path;

    // Create admin user
    user = await User.create({
      ...userData,
      email,
      avatar,
      role: "admin",
      authProvider: "local",
      emailVerified: false,
      isApproved: true, // Admins are auto-approved
      isActive: true,
    });

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    res.status(201).json({
      status: "success",
      message: "Admin registration successful. Please verify your email.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// ==================== PATIENT REGISTRATION ====================
exports.registerPatient = async (req, res, next) => {
  try {
    // Parse form data before validation
    const parsedBody = parsePatientRegistration(req.body);

    const { error } = patientRegisterSchema.validate(parsedBody);
    if (error) throw new BadRequestError(error.details[0].message);

    const { email, phoneNumber, emergencyContact, ...userData } = parsedBody;
    let user = await User.findOne({ where: { email } });
    if (user) throw new ConflictError("User already exists with this email");

    let avatar = undefined;
    if (req.file) avatar = req.file.path;

    // Create user first
    user = await User.create({
      ...userData,
      email,
      avatar,
      role: "patient",
      authProvider: "local",
      emailVerified: false,
      isApproved: true, // Patients are auto-approved
      isActive: true,
    });

    // Create patient profile
    const patientData = {
      userId: user.id,
      phoneNumber,
      emergencyContact,
    };

    await Patient.create(patientData);

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    res.status(201).json({
      status: "success",
      message: "Patient registration successful. Please verify your email.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// ==================== DOCTOR REGISTRATION ====================
exports.registerDoctor = async (req, res, next) => {
  try {
    // Parse form data before validation
    const parsedBody = parseDoctorRegistration(req.body);

    const { error } = doctorRegisterSchema.validate(parsedBody);
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

    let user = await User.findOne({ where: { email } });
    if (user) throw new ConflictError("User already exists with this email");

    // Handle file uploads
    let uploadedFiles = {};
    if (req.files) {
      const documentNames = parseDocumentNames(req.body);
      uploadedFiles = await handleFileUploads(req.files, documentNames);
    }

    // Create user first
    user = await User.create({
      ...userData,
      email,
      avatar: uploadedFiles.avatar,
      role: "doctor",
      authProvider: "local",
      emailVerified: false,
      isApproved: false, // Doctors need approval
      isActive: true,
    });

    // Create doctor profile
    const doctorData = {
      userId: user.id,
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
      paymentMethods: paymentMethods || {},
      documents: uploadedFiles.documents || {},
    };

    await Doctor.create(doctorData);

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      await cleanUpFileImages(req);
      return next(new BadRequestError(err.message));
    }

    res.status(201).json({
      status: "success",
      message:
        "Doctor registration successful. Please verify your email and wait for approval.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// ==================== PHARMACY REGISTRATION ====================
exports.registerPharmacy = async (req, res, next) => {
  try {
    // Parse form data before validation
    const parsedBody = parsePharmacyRegistration(req.body);

    const { error } = pharmacyRegisterSchema.validate(parsedBody);
    if (error) throw new BadRequestError(error.details[0].message);

    const {
      email,
      pharmacyName,
      licenseNumber,
      description,
      address,
      contactInfo,
      deliveryInfo,
      paymentMethods,
      ...userData
    } = parsedBody;

    let user = await User.findOne({ where: { email } });
    if (user) throw new ConflictError("User already exists with this email");

    // Handle file uploads
    let uploadedFiles = {};
    if (req.files) {
      const documentNames = parseDocumentNames(req.body);
      uploadedFiles = await handleFileUploads(req.files, documentNames);
    }

    // Create user first
    user = await User.create({
      ...userData,
      email,
      avatar: uploadedFiles.avatar,
      role: "pharmacy",
      authProvider: "local",
      emailVerified: false,
      isApproved: false, // Pharmacies need approval
      isActive: true,
    });

    // Create pharmacy profile
    const pharmacyData = {
      userId: user.id,
      name: pharmacyName,
      licenseNumber,
      description,
      logo: uploadedFiles.logo,
      images: uploadedFiles.images || [],
      address,
      contactInfo,
      deliveryInfo: deliveryInfo || {},
      paymentMethods: paymentMethods || ["cash"],
      documents: uploadedFiles.documents || {},
    };

    await Pharmacy.create(pharmacyData);

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    res.status(201).json({
      status: "success",
      message:
        "Pharmacy registration successful. Please verify your email and wait for approval.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};
