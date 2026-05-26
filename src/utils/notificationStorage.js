const NOTIFICATION_KEY_PREFIX = 'tadNotificationReadKeys';

const storageKey = (userId) => `${NOTIFICATION_KEY_PREFIX}:${userId || 'anonymous'}`;

export const notificationStorage = {
  getReadKeys: (userId) => {
    const rawValue = localStorage.getItem(storageKey(userId));
    if (!rawValue) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(storageKey(userId));
      return [];
    }
  },

  saveReadKeys: (userId, keys) => {
    localStorage.setItem(storageKey(userId), JSON.stringify([...new Set(keys)]));
  },

  clear: (userId) => {
    localStorage.removeItem(storageKey(userId));
  },
};
