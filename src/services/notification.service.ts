import { io, Socket } from 'socket.io-client';
import { notificationsApi } from './notifications.api';

export interface Notification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_UNASSIGNED' | 'TASK_STATUS_CHANGED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

class NotificationService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://localhost:3001';
  private notificationCallback: ((notification: Notification) => void) | null = null;

  // Conectar ao WebSocket
  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado ao servidor de notificações');
      this.socket?.emit('authenticate', { userId });
    });

    this.socket.on('authenticated', (data) => {
      console.log('✅ Autenticação WebSocket confirmada:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor de notificações');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão com WebSocket:', error);
    });
  }

  // Desconectar do WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Escutar novas notificações
  onNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.on('notification', (notification: Notification) => {
        console.log('🔔 Notificação recebida via WebSocket:', notification);
        // Chamar callback se existir
        if (this.notificationCallback) {
          this.notificationCallback(notification);
        }
      });
      this.notificationCallback = callback;
    }
  }

  // Parar de escutar notificações
  offNotification(): void {
    this.notificationCallback = null;
    if (this.socket) {
      this.socket.off('notification');
    }
  }

  // Listar notificações do usuário
  async getNotifications(): Promise<Notification[]> {
    try {
      return await notificationsApi.getNotifications();
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Contar notificações não lidas
  async getUnreadCount(): Promise<number> {
    try {
      return await notificationsApi.getUnreadCount();
    } catch (error) {
      console.error('Erro ao buscar contagem de não lidas:', error);
      throw error;
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await notificationsApi.markAsRead(notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(): Promise<void> {
    try {
      await notificationsApi.markAllAsRead();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      throw error;
    }
  }

  // Verificar se está conectado
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const notificationService = new NotificationService();
