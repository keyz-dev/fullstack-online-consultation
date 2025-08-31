/**
 * Notification Deduplication Service
 * Prevents duplicate notifications from multiple sources
 */

interface NotificationKey {
  type: string;
  reference?: string;
  userId?: string;
  message?: string;
}

class NotificationDeduplicator {
  private static instance: NotificationDeduplicator;
  private recentNotifications: Map<string, number> = new Map();
  private readonly DEDUPLICATION_WINDOW = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): NotificationDeduplicator {
    if (!NotificationDeduplicator.instance) {
      NotificationDeduplicator.instance = new NotificationDeduplicator();
    }
    return NotificationDeduplicator.instance;
  }

  private generateKey(notification: NotificationKey): string {
    const { type, reference, userId, message } = notification;
    return `${type}:${reference || ''}:${userId || ''}:${message?.substring(0, 50) || ''}`;
  }

  public shouldShow(notification: NotificationKey): boolean {
    const key = this.generateKey(notification);
    const now = Date.now();
    const lastShown = this.recentNotifications.get(key);

    // If notification was shown recently, don't show again
    if (lastShown && (now - lastShown) < this.DEDUPLICATION_WINDOW) {
      console.log(`🚫 Blocking duplicate notification: ${key}`);
      return false;
    }

    // Record this notification
    this.recentNotifications.set(key, now);
    
    // Cleanup old entries periodically
    this.cleanup();
    
    console.log(`✅ Allowing notification: ${key}`);
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.recentNotifications.forEach((timestamp, key) => {
      if (now - timestamp > this.DEDUPLICATION_WINDOW * 2) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.recentNotifications.delete(key);
    });
  }

  public clear(): void {
    this.recentNotifications.clear();
  }
}

export const notificationDeduplicator = NotificationDeduplicator.getInstance();

// Helper function for easy use
export const shouldShowNotification = (
  type: string,
  message: string,
  reference?: string,
  userId?: string
): boolean => {
  return notificationDeduplicator.shouldShow({
    type,
    message,
    reference,
    userId
  });
};

