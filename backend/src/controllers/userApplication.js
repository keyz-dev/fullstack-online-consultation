const {
  UserApplication,
  User,
  Doctor,
  Pharmacy,
  ApplicationDocument,
  Notification,
} = require("../db/models");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const { logger } = require("../utils/logger");
const emailService = require("../services/emailService");

// Helper function to create notifications
const createNotification = async (
  userId,
  type,
  title,
  message,
  priority = "medium"
) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      priority,
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
        },
      });
    }

    return notification;
  } catch (error) {
    logger.error("Error creating notification:", error);
    // Don't fail the main operation if notification fails
  }
};

// Get user's current application
exports.getUserApplication = async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    const application = await UserApplication.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "licenseNumber", "experience", "bio"],
          required: false,
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          attributes: ["id", "name", "licenseNumber", "description"],
          required: false,
        },
        {
          model: ApplicationDocument,
          as: "documents",
          attributes: [
            "id",
            "documentType",
            "fileName",
            "fileUrl",
            "verifiedAt",
            "verificationNotes",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Get specific application status
exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const application = await UserApplication.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "licenseNumber", "experience", "bio"],
          required: false,
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          attributes: ["id", "name", "licenseNumber", "description"],
          required: false,
        },
        {
          model: ApplicationDocument,
          as: "documents",
          attributes: [
            "id",
            "documentType",
            "fileName",
            "fileUrl",
            "verifiedAt",
            "verificationNotes",
          ],
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Reapply for rejected application
exports.reapplyApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const application = await UserApplication.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    if (application.status !== "rejected") {
      return next(
        new BadRequestError("Only rejected applications can be reapplied")
      );
    }

    // Check if user has incomplete role (after rejection, role should be downgraded)
    if (!application.user.role.startsWith("incomplete_")) {
      return next(
        new BadRequestError(
          "User must have incomplete role to reapply. Please contact support if you believe this is an error."
        )
      );
    }

    // Update application to pending
    await application.update({
      status: "pending",
      applicationVersion: application.applicationVersion + 1,
      submittedAt: new Date(),
      adminReview: null,
      adminNotes: null,
      rejectionReason: null,
      reviewedAt: null,
      rejectedAt: null,
    });

    // Update user role to pending
    const newRole =
      application.applicationType === "doctor"
        ? "pending_doctor"
        : "pending_pharmacy";
    await application.user.update({ role: newRole });

    // Create notification for user
    await createNotification(
      userId,
      "application_under_review",
      "Application Resubmitted",
      `Your ${application.applicationType} application has been resubmitted and is under review.`,
      "medium"
    );

    // Send email notification for resubmission
    try {
      await emailService.sendApplicationSubmittedEmail(
        application,
        application.user
      );
    } catch (emailError) {
      logger.error(
        "Failed to send application resubmission email:",
        emailError
      );
      // Don't fail the main operation if email fails
    }

    // Notify admins
    const admins = await User.findAll({ where: { role: "admin" } });
    for (const admin of admins) {
      await createNotification(
        admin.id,
        "system_announcement",
        "Application Resubmitted",
        `A ${application.applicationType} application has been resubmitted by ${application.user.name}.`,
        "high"
      );
    }

    res.status(200).json({
      success: true,
      message: "Application resubmitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Activate account after approval
exports.activateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const application = await UserApplication.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    if (application.status !== "approved") {
      return next(
        new BadRequestError("Only approved applications can be activated")
      );
    }

    // Check if user has pending role
    if (!application.user.role.startsWith("pending_")) {
      return next(
        new BadRequestError("User must have pending role to activate account")
      );
    }

    // Update user role to active
    const newRole =
      application.applicationType === "doctor" ? "doctor" : "pharmacy";
    await application.user.update({ role: newRole });

    // Create notification for user
    await createNotification(
      userId,
      "application_approved",
      "Account Activated",
      `Your ${application.applicationType} account has been activated successfully!`,
      "high"
    );

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
      data: {
        role: newRole,
        applicationId: application.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel application
exports.cancelApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const application = await UserApplication.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    if (application.status === "approved") {
      return next(
        new BadRequestError("Approved applications cannot be cancelled")
      );
    }

    // Update user role back to incomplete
    const incompleteRole =
      application.applicationType === "doctor"
        ? "incomplete_doctor"
        : "incomplete_pharmacy";
    await application.user.update({ role: incompleteRole });

    // Delete the application
    await application.destroy();

    // Create notification for user
    await createNotification(
      userId,
      "general",
      "Application Cancelled",
      `Your ${application.applicationType} application has been cancelled.`,
      "medium"
    );

    res.status(200).json({
      success: true,
      message: "Application cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};
