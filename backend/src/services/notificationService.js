const {
  Notification,
  ActivityLog,
  SystemNotification,
  User,
} = require("../db/models");

class NotificationService {
  /**
   * Create a user-specific notification
   */
  static async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Create multiple notifications for multiple users
   */
  static async createBulkNotifications(notifications) {
    try {
      const createdNotifications = await Notification.bulkCreate(notifications);
      return createdNotifications;
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
      throw error;
    }
  }

  /**
   * Create a system notification (broadcast)
   */
  static async createSystemNotification(data) {
    try {
      const systemNotification = await SystemNotification.create(data);
      return systemNotification;
    } catch (error) {
      console.error("Error creating system notification:", error);
      throw error;
    }
  }

  /**
   * Create an activity log entry
   */
  static async createActivityLog(data) {
    try {
      const activityLog = await ActivityLog.create(data);
      return activityLog;
    } catch (error) {
      console.error("Error creating activity log:", error);
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      isRead = null,
      category = null,
      type = null,
    } = options;

    const where = { user_id: userId };

    if (isRead !== null) where.is_read = isRead;
    if (category) where.category = category;
    if (type) where.type = type;

    try {
      const notifications = await Notification.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "role"],
          },
        ],
      });

      return {
        notifications: notifications.rows,
        total: notifications.count,
        page: parseInt(page),
        totalPages: Math.ceil(notifications.count / limit),
      };
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  }

  /**
   * Get recent activity logs
   */
  static async getRecentActivity(options = {}) {
    const {
      page = 1,
      limit = 50,
      activityType = null,
      userId = null,
    } = options;

    const where = {};

    if (activityType) where.activity_type = activityType;
    if (userId) where.user_id = userId;

    try {
      const activityLogs = await ActivityLog.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "role"],
          },
        ],
      });

      return {
        activityLogs: activityLogs.rows,
        total: activityLogs.count,
        page: parseInt(page),
        totalPages: Math.ceil(activityLogs.count / limit),
      };
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId },
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      await notification.update({ is_read: true });
      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId) {
    try {
      await Notification.update(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
      );
      return { success: true };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count for user
   */
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { user_id: userId, is_read: false },
      });
      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  /**
   * Get active system notifications for user role
   */
  static async getActiveSystemNotifications(userRole) {
    try {
      const systemNotifications = await SystemNotification.findAll({
        where: {
          is_active: true,
          target_roles: { [require("sequelize").Op.contains]: [userRole] },
          [require("sequelize").Op.or]: [
            { expires_at: null },
            { expires_at: { [require("sequelize").Op.gt]: new Date() } },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      return systemNotifications;
    } catch (error) {
      console.error("Error fetching system notifications:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
