/**
 * Componente de Guardado de Notificaciones
 * Usando toast notifications simuladas
 */

export class NotificationManager {
  static notifications = [];
  static listeners = [];

  static subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static notify(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const notification = { id, message, type, duration };

    this.notifications.push(notification);
    this.listeners.forEach((listener) => listener(this.notifications));

    if (duration > 0) {
      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this.listeners.forEach((listener) => listener(this.notifications));
      }, duration);
    }

    return id;
  }

  static success(message, duration = 3000) {
    return this.notify(message, 'success', duration);
  }

  static error(message, duration = 4000) {
    return this.notify(message, 'error', duration);
  }

  static info(message, duration = 3000) {
    return this.notify(message, 'info', duration);
  }

  static warning(message, duration = 3000) {
    return this.notify(message, 'warning', duration);
  }

  static dismiss(id) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.listeners.forEach((listener) => listener(this.notifications));
  }
}

// Componente para mostrar notificaciones
import { useEffect, useState } from 'react';

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '◆';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${getStyle(notif.type)} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
        >
          <span className="text-xl font-bold">{getIcon(notif.type)}</span>
          <span className="flex-1">{notif.message}</span>
          <button
            onClick={() => NotificationManager.dismiss(notif.id)}
            className="ml-2 opacity-70 hover:opacity-100 text-lg"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
