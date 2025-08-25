const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const { Notification, User } = require("../db/models");
const { Op } = require("sequelize");
const { BadRequestError, NotFoundError } = require("../utils/errors");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

/**
 * GET /api/notifications
 * Get user notifications with pagination and filtering
 */
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      isRead = null,
      type = null,
      priority = null,
      search = null,
    } = req.query;

    const userId = req.authUser.id;
    const whereClause = { user_id: userId };

    // Add filters
    if (isRead !== null) {
      whereClause.isRead = isRead === "true";
    }

    if (type && type !== "all") {
      whereClause.type = type;
    }

    if (priority && priority !== "all") {
      whereClause.priority = priority;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get("/unread-count", async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    const count = await Notification.count({
      where: {
        user_id: userId,
        isRead: false,
      },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put("/:id/read", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const notification = await Notification.findOne({
      where: {
        id: parseInt(id),
        user_id: userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    await notification.update({
      isRead: true,
      readAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read
 */
router.put("/mark-all-read", async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    await Notification.update(
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        where: {
          user_id: userId,
          isRead: false,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser.id;

    const notification = await Notification.findOne({
      where: {
        id: parseInt(id),
        user_id: userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/notifications/clear-all
 * Clear all notifications for user
 */
router.delete("/clear-all", async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    await Notification.destroy({
      where: {
        user_id: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics
 */
router.get("/stats", async (req, res, next) => {
  try {
    const userId = req.authUser.id;

    const [total, unread, urgent, high] = await Promise.all([
      Notification.count({ where: { user_id: userId } }),
      Notification.count({ where: { user_id: userId, isRead: false } }),
      Notification.count({
        where: { user_id: userId, priority: "urgent", isRead: false },
      }),
      Notification.count({
        where: { user_id: userId, priority: "high", isRead: false },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        urgent,
        high,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
