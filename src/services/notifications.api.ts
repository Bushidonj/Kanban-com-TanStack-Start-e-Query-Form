import api from './api';
import type { Notification } from './notification.service';

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationsApi = {
  // Listar todas as notificações do usuário
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  // Obter contagem de notificações não lidas
  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.count;
  },

  // Marcar notificação específica como lida
  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
  },

  // Marcar todas as notificações como lidas
  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/mark-all-read');
  },

  // Deletar notificação específica
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Deletar todas as notificações lidas
  async deleteReadNotifications(): Promise<void> {
    await api.delete('/notifications/read');
  },

  // Buscar notificações com paginação
  async getNotificationsPaginated(page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    const response = await api.get<NotificationsResponse>('/notifications', {
      params: { page, limit }
    });
    return response.data;
  },

  // Buscar notificações por tipo
  async getNotificationsByType(type: Notification['type']): Promise<Notification[]> {
    const response = await api.get<Notification[]>(`/notifications/type/${type}`);
    return response.data;
  },

  // Buscar notificações não lidas
  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications/unread');
    return response.data;
  }
};
