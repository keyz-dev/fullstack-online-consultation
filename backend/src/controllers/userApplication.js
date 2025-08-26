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
    const userId = req.authUser.id;

    // For /me/reapply route, find the user's application
    // For /:id/reapply route, use the provided id
    const { id } = req.params;
    const whereClause = id ? { id, userId } : { userId };

    const application = await UserApplication.findOne({
      where: whereClause,
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
    const userId = req.authUser.id;

    // For /me/activate route, find the user's application
    // For /:id/activate route, use the provided id
    const { id } = req.params;
    const whereClause = id
      ? { id, userId, status: "approved" }
      : { userId, status: "approved" };

    const application = await UserApplication.findOne({
      where: whereClause,
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
        redirectUrl: `/${newRole.toLowerCase()}`,
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

// Refresh application status
exports.refreshApplicationStatus = async (req, res, next) => {
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
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this user",
      });
    }

    // In a real implementation, you might want to check with external systems
    // or update the status based on time elapsed, etc.
    const lastChecked = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: "Application status refreshed",
      data: {
        status: application.status,
        lastChecked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get application timeline/history
exports.getApplicationTimeline = async (req, res, next) => {
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
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this user",
      });
    }

    // Create timeline based on application events
    const timeline = [];

    // Application submitted
    if (application.submittedAt) {
      timeline.push({
        id: 1,
        action: "application_submitted",
        description: "Application submitted for review",
        timestamp: application.submittedAt,
        status: "completed",
      });
    }

    // Application under review
    if (
      application.status === "under_review" ||
      application.status === "approved" ||
      application.status === "rejected"
    ) {
      timeline.push({
        id: 2,
        action: "application_reviewed",
        description: "Application reviewed by admin",
        timestamp: application.reviewedAt || application.submittedAt,
        status: "completed",
      });
    }

    // Application approved
    if (application.status === "approved" && application.approvedAt) {
      timeline.push({
        id: 3,
        action: "application_approved",
        description: "Application approved",
        timestamp: application.approvedAt,
        status: "completed",
      });
    }

    // Application rejected
    if (application.status === "rejected" && application.rejectedAt) {
      timeline.push({
        id: 4,
        action: "application_rejected",
        description: `Application rejected: ${application.rejectionReason || "No reason provided"}`,
        timestamp: application.rejectedAt,
        status: "completed",
      });
    }

    // Sort timeline by timestamp
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

// Download application document
exports.downloadDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const userId = req.authUser.id;

    // Find the document and ensure it belongs to the user's application
    const document = await ApplicationDocument.findOne({
      include: [
        {
          model: UserApplication,
          as: "application",
          where: { userId },
          attributes: ["id", "userId"],
        },
      ],
      where: { id: documentId },
    });

    if (!document) {
      return next(new NotFoundError("Document not found"));
    }

    // Check if file exists
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(__dirname, "../uploads", document.fileName);

    if (!fs.existsSync(filePath)) {
      return next(new NotFoundError("File not found"));
    }

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      document.mimeType || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// Get application statistics
exports.getApplicationStats = async (req, res, next) => {
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
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this user",
      });
    }

    // Calculate statistics
    const now = new Date();
    const submittedDate = new Date(application.submittedAt);
    const daysSinceSubmission = Math.floor(
      (now - submittedDate) / (1000 * 60 * 60 * 24)
    );

    // Estimate review time based on application type
    const estimatedReviewTime =
      application.applicationType === "doctor"
        ? "5-7 business days"
        : "3-5 business days";

    const stats = {
      totalApplications: 1, // User can only have one active application
      currentStatus: application.status,
      daysSinceSubmission,
      estimatedReviewTime,
      lastUpdated: application.updatedAt.toISOString(),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
