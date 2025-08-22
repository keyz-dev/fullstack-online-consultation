const {
  User,
  Patient,
  Doctor,
  Pharmacy,
  UserApplication,
  ApplicationDocument,
  DoctorSpecialty,
  Notification,
} = require("../db/models");
const { sequelize } = require("../db/models");
const { BadRequestError, ConflictError } = require("../utils/errors");
const { handleFileUploads } = require("../utils/documentUtil");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

// Helper function to create notifications (similar to vendorApp)
const createNotification = async (
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedModel = "UserApplication",
  priority = "medium"
) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type: "system", // Use system type for application notifications
      title,
      message,
      priority,
      data: {
        relatedId: relatedId,
        relatedModel: relatedModel,
        category: "applications",
      },
      isRead: false,
    });

    // Emit real-time notification if socket is available
    if (global.io) {
      global.io.to(`user-${userId}`).emit("notification:new", {
        notification: {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          data: notification.data,
        },
      });
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't fail the main operation if notification fails
  }
};

// Helper function to notify admins
const notifyAdmins = async (notificationType, title, message, relatedId) => {
  try {
    const admins = await User.findAll({ where: { role: "admin" } });
    for (const admin of admins) {
      await createNotification(
        admin.id,
        notificationType,
        title,
        message,
        relatedId,
        "UserApplication",
        "high"
      );
    }
  } catch (error) {
    console.error("Error notifying admins:", error);
    // Don't fail the main operation if admin notification fails
  }
};

class RegistrationService {
  // ==================== ADMIN REGISTRATION ====================
  static async registerAdmin(userData, avatar = null) {
    const { email, ...otherUserData } = userData;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) throw new ConflictError("User already exists with this email");

    // Create admin user
    user = await User.create({
      ...otherUserData,
      email,
      avatar,
      role: "admin",
      authProvider: "local",
      emailVerified: false,
      isApproved: true, // Admins are auto-approved
      isActive: true,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    return {
      user: { id: user.id, email: user.email },
      message: "Admin registration successful. Please verify your email.",
    };
  }

  // ==================== PATIENT REGISTRATION ====================
  static async registerPatient(userData, patientData, avatar = null) {
    const { email, ...otherUserData } = userData;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) throw new ConflictError("User already exists with this email");

    // Create user first
    user = await User.create({
      ...otherUserData,
      email,
      avatar,
      role: "patient",
      authProvider: "local",
      emailVerified: false,
      isApproved: true, // Patients are auto-approved
      isActive: true,
    });

    // Create patient profile
    await Patient.create({
      userId: user.id,
      ...patientData,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    return {
      user: { id: user.id, email: user.email },
      message: "Patient registration successful. Please verify your email.",
    };
  }

  // ==================== DOCTOR REGISTRATION (ACID-COMPLIANT) ====================
  static async registerDoctor(userData, doctorData, uploadedFiles = {}) {
    const transaction = await sequelize.transaction();

    try {
      const { email, ...otherUserData } = userData;
      const { specialties, ...otherDoctorData } = doctorData;

      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) throw new ConflictError("User already exists with this email");

      // Set nextVersion to 1 for new users
      let nextVersion = 1;

      // 1. Create User (pending role)
      user = await User.create(
        {
          ...otherUserData,
          email,
          avatar: uploadedFiles.avatar,
          role: "pending_doctor",
          authProvider: "local",
          emailVerified: false,
          isApproved: false, // Doctors need approval
          isActive: true,
        },
        { transaction }
      );

      // 2. Create Doctor (clean business data only)
      const doctor = await Doctor.create(
        {
          userId: user.id,
          ...otherDoctorData,
          isVerified: false,
          isActive: true,
        },
        { transaction }
      );

      // 3. Create UserApplication
      const application = await UserApplication.create(
        {
          userId: user.id,
          applicationType: "doctor",
          typeId: doctor.id,
          status: "pending",
          applicationVersion: nextVersion,
          submittedAt: new Date(),
        },
        { transaction }
      );

      // 4. Create ApplicationDocuments
      if (uploadedFiles.documents) {
        const documentPromises = Object.entries(uploadedFiles.documents).map(
          ([type, file]) =>
            ApplicationDocument.create(
              {
                applicationId: application.id,
                documentType: type,
                fileName: file.originalName || file.originalname,
                filePath: file.path, // Use filePath for local files
                fileUrl: file.url, // Use fileUrl for cloud storage
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadedAt: new Date(),
              },
              { transaction }
            )
        );
        await Promise.all(documentPromises);
      }

      // 5. Create DoctorSpecialty relationships
      if (specialties && specialties.length > 0) {
        const specialtyPromises = specialties.map((specialtyId) =>
          DoctorSpecialty.create(
            {
              doctorId: doctor.id,
              specialtyId: specialtyId,
            },
            { transaction }
          )
        );
        await Promise.all(specialtyPromises);
      }

      await transaction.commit();

      // Create notification for user
      await createNotification(
        user.id,
        "doctor_application_submitted",
        "Application Submitted Successfully",
        `Your doctor application has been submitted and is under review.`,
        application.id,
        "UserApplication",
        "medium"
      );

      // Notify admins
      await notifyAdmins(
        "doctor_application_submitted",
        "New Doctor Application",
        `A new doctor application has been submitted by ${user.name} with license number ${doctorData.licenseNumber}.`,
        application.id
      );

      // Send verification email
      try {
        await sendVerificationEmail(user, email, user.name);
      } catch (err) {
        console.error("Failed to send verification email:", err);
        // Don't fail the request if email fails
      }

      return {
        user: { id: user.id, email: user.email },
        application: { id: application.id, status: application.status },
        message:
          "Doctor registration successful. Please verify your email and wait for approval.",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==================== PHARMACY REGISTRATION (ACID-COMPLIANT) ====================
  static async registerPharmacy(userData, pharmacyData, uploadedFiles = {}) {
    const transaction = await sequelize.transaction();

    try {
      const { email, ...otherUserData } = userData;

      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) throw new ConflictError("User already exists with this email");

      // Set nextVersion to 1 for new users
      let nextVersion = 1;

      // 1. Create User (pending role)
      user = await User.create(
        {
          ...otherUserData,
          email,
          avatar: uploadedFiles.avatar,
          role: "pending_pharmacy",
          authProvider: "local",
          emailVerified: false,
          isApproved: false, // Pharmacies need approval
          isActive: true,
        },
        { transaction }
      );

      // 2. Create Pharmacy (clean business data only)
      const pharmacy = await Pharmacy.create(
        {
          userId: user.id,
          ...pharmacyData,
          isVerified: false,
          isActive: true,
        },
        { transaction }
      );

      // 3. Create UserApplication
      const application = await UserApplication.create(
        {
          userId: user.id,
          applicationType: "pharmacy",
          typeId: pharmacy.id,
          status: "pending",
          applicationVersion: nextVersion,
          submittedAt: new Date(),
        },
        { transaction }
      );

      // 4. Create ApplicationDocuments
      if (uploadedFiles.documents) {
        const documentPromises = Object.entries(uploadedFiles.documents).map(
          ([type, file]) =>
            ApplicationDocument.create(
              {
                applicationId: application.id,
                documentType: type,
                fileName: file.originalName || file.originalname,
                filePath: file.path, // Use filePath for local files
                fileUrl: file.url, // Use fileUrl for cloud storage
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadedAt: new Date(),
              },
              { transaction }
            )
        );
        await Promise.all(documentPromises);
      }

      await transaction.commit();

      // Create notification for user
      await createNotification(
        user.id,
        "pharmacy_application_submitted",
        "Application Submitted Successfully",
        `Your pharmacy application has been submitted and is under review.`,
        application.id,
        "UserApplication",
        "medium"
      );

      // Notify admins
      await notifyAdmins(
        "pharmacy_application_submitted",
        "New Pharmacy Application",
        `A new pharmacy application has been submitted by ${user.name} for "${pharmacyData.name}".`,
        application.id
      );

      // Send verification email
      try {
        await sendVerificationEmail(user, email, user.name);
      } catch (err) {
        console.error("Failed to send verification email:", err);
        // Don't fail the request if email fails
      }

      return {
        user: { id: user.id, email: user.email },
        application: { id: application.id, status: application.status },
        message:
          "Pharmacy registration successful. Please verify your email and wait for approval.",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = RegistrationService;
