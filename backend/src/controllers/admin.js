const {
  UserApplication,
  User,
  Doctor,
  Pharmacy,
  ApplicationDocument,
  Notification,
} = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { Op } = require("sequelize");
const {
  formatApplicationsData,
  formatApplicationData,
  formatApplicationStats,
} = require("../utils/returnFormats/applicationData");

// Helper function to create notifications
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
      type,
      title,
      message,
      relatedId,
      relatedModel,
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
          relatedId: notification.relatedId,
          relatedModel: notification.relatedModel,
        },
      });
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't fail the main operation if notification fails
  }
};

// Admin: Get all applications with filtering and pagination
exports.getAllApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, applicationType, search } = req.query;

    const whereClause = {};

    // Add status filter
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // Add application type filter
    if (applicationType && applicationType !== "all") {
      whereClause.applicationType = applicationType;
    }

    // Add search filter - we'll handle this in the frontend since we're fetching all data
    // The search will be done client-side in the useAdminApplications hook

    // If limit is 1000 or more, fetch all applications (for client-side filtering)
    const isFetchAll = parseInt(limit) >= 1000;
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phoneNumber", "avatar"],
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
      order: [["submittedAt", "DESC"]],
    };

    if (!isFetchAll) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = offset;
    }

    const applications = await UserApplication.findAndCountAll(queryOptions);

    // Debug logging
    console.log("Applications found:", applications.count);
    console.log("Sample application:", applications.rows[0]?.toJSON());

    // Fetch related doctor and pharmacy data separately to avoid polymorphic association issues
    const applicationsWithDetails = await Promise.all(
      applications.rows.map(async (application) => {
        const applicationData = application.toJSON();

        if (application.applicationType === "doctor") {
          const doctor = await Doctor.findByPk(application.typeId, {
            attributes: [
              "id",
              "licenseNumber",
              "experience",
              "bio",
              "clinicAddress",
            ],
          });
          applicationData.doctor = doctor;
          console.log(
            "Doctor data for application",
            application.id,
            ":",
            doctor
          );
        } else if (application.applicationType === "pharmacy") {
          const pharmacy = await Pharmacy.findByPk(application.typeId, {
            attributes: [
              "id",
              "name",
              "licenseNumber",
              "description",
              "address",
            ],
          });
          applicationData.pharmacy = pharmacy;
          console.log(
            "Pharmacy data for application",
            application.id,
            ":",
            pharmacy
          );
        }

        return applicationData;
      })
    );

    console.log(
      "Final applications with details:",
      applicationsWithDetails.length
    );
    console.log("Sample final application:", applicationsWithDetails[0]);

    // Format the applications using the return format
    const formattedApplications = formatApplicationsData(
      applicationsWithDetails
    );

    res.status(200).json({
      success: true,
      data: {
        applications: formattedApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: isFetchAll
            ? 1
            : Math.ceil(applications.count / parseInt(limit)),
          totalApplications: applications.count,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get application statistics
exports.getApplicationStats = async (req, res, next) => {
  try {
    const [total, pending, underReview, approved, rejected, suspended] =
      await Promise.all([
        UserApplication.count(),
        UserApplication.count({ where: { status: "pending" } }),
        UserApplication.count({ where: { status: "under_review" } }),
        UserApplication.count({ where: { status: "approved" } }),
        UserApplication.count({ where: { status: "rejected" } }),
        UserApplication.count({ where: { status: "suspended" } }),
      ]);

    const stats = {
      total,
      pending,
      underReview,
      approved,
      rejected,
      suspended,
    };

    const formattedStats = formatApplicationStats(stats);

    res.status(200).json({
      success: true,
      data: {
        stats: formattedStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single application with details
exports.getApplication = async (req, res, next) => {
  try {
    const application = await UserApplication.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phoneNumber", "avatar"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            "id",
            "licenseNumber",
            "experience",
            "bio",
            "education",
            "languages",
            "specialties",
            "clinicAddress",
            "operationalHospital",
            "contactInfo",
            "consultationFee",
            "consultationDuration",
            "paymentMethods",
          ],
          required: false,
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          attributes: [
            "id",
            "name",
            "licenseNumber",
            "description",
            "logo",
            "images",
            "address",
            "contactInfo",
            "operatingHours",
            "paymentMethods",
          ],
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
            "fileSize",
            "mimeType",
            "expiryDate",
            "verifiedAt",
            "verificationNotes",
            "uploadedAt",
          ],
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    const formattedApplication = formatApplicationData(application);

    res.status(200).json({
      success: true,
      data: formattedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Review application (approve/reject)
exports.reviewApplication = async (req, res, next) => {
  try {
    const { status, remarks, rejectionReason, documentReviews } = req.body;

    // Validate required fields
    if (!status || !["approved", "rejected"].includes(status)) {
      throw new BadRequestError(
        "Status must be either 'approved' or 'rejected'"
      );
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      throw new BadRequestError("Rejection reason is required");
    }

    const application = await UserApplication.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Doctor,
          as: "doctor",
          required: false,
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          required: false,
        },
      ],
    });

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    // Check if application can be reviewed
    if (!application.canBeReviewed()) {
      throw new BadRequestError(
        "Application cannot be reviewed in its current status"
      );
    }

    // Prepare update data
    const updateData = {
      status,
      adminReview: {
        reviewedBy: req.authUser.id,
        reviewedAt: new Date(),
        remarks: remarks || null,
      },
      reviewedAt: new Date(),
    };

    if (status === "approved") {
      updateData.approvedAt = new Date();

      // Create notification for user
      await createNotification(
        application.userId,
        "application_approved",
        "Application Approved!",
        `Congratulations! Your ${application.applicationType} application has been approved. You can now access your dashboard.`,
        application.id,
        "UserApplication",
        "high"
      );
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = rejectionReason;
      updateData.adminReview.rejectionReason = rejectionReason;

      // Create notification for user
      await createNotification(
        application.userId,
        "application_rejected",
        "Application Update",
        `Your ${application.applicationType} application requires attention. Please check the details for more information.`,
        application.id,
        "UserApplication",
        "high"
      );
    }

    // Handle document reviews if provided
    if (documentReviews && documentReviews.length > 0) {
      for (const docReview of documentReviews) {
        try {
          const document = await ApplicationDocument.findByPk(
            docReview.documentId
          );
          if (document && document.applicationId === application.id) {
            await document.update({
              verifiedAt: docReview.isApproved ? new Date() : null,
              verifiedBy: req.authUser.id,
              verificationNotes: docReview.remarks || null,
            });
          }
        } catch (error) {
          console.error("Error updating document review:", error);
        }
      }
    }

    // Update the application
    await application.update(updateData);

    // Update user role if approved
    if (status === "approved") {
      const newRole =
        application.applicationType === "doctor" ? "doctor" : "pharmacy";
      await application.user.update({ role: newRole });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
