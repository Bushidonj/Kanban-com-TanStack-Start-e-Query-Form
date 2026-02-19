import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '../services/notification.service';
import { notificationService } from '../services/notification.service';
import { useSession } from './useSession';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Query para buscar notificações
  const {
    data: notificationsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    enabled: !!session?.isAuthenticated,
    refetchInterval: session?.isAuthenticated ? 30000 : false, // Atualizar a cada 30 segundos apenas se autenticado
  });

  // Query para buscar contagem de não lidas
  const {
    data: unreadData = 0,
    refetch: refetchUnreadCount,
  } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: notificationService.getUnreadCount,
    enabled: !!session?.isAuthenticated,
    refetchInterval: session?.isAuthenticated ? 15000 : false, // Atualizar a cada 15 segundos apenas se autenticado
  });

  // Mutation para marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  // Mutation para marcar todas como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  // Conectar ao WebSocket quando o usuário estiver autenticado
  useEffect(() => {
    if (session?.isAuthenticated && session.user) {
      // ✅ CORREÇÃO: Usar ID do usuário em vez de email
      const userId = session.user.id || session.user.email || 'unknown';
      
      console.log('🔔 Conectando WebSocket com userId:', userId);
      
      notificationService.connect(userId);
      setIsConnected(notificationService.isConnected());

      // Escutar novas notificações
      const handleNewNotification = (notification: Notification) => {
        console.log('🔔 Nova notificação recebida:', notification);
        setNotifications(prev => [notification, ...prev]);
        if (!notification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
        
        // Invalidar queries para buscar dados atualizados
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
      };

      notificationService.onNotification(handleNewNotification);

      // Cleanup
      return () => {
        notificationService.offNotification();
      };
    }
  }, [session?.isAuthenticated, session?.user?.id, session?.user?.email, queryClient]);

  // Atualizar estado local quando os dados da query mudam
  useEffect(() => {
    setNotifications(notificationsData);
  }, [notificationsData]);

  useEffect(() => {
    setUnreadCount(unreadData);
  }, [unreadData]);

  // Funções de ação
  const markAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const refreshNotifications = useCallback(() => {
    refetch();
    refetchUnreadCount();
  }, [refetch, refetchUnreadCount]);

  // Desconectar ao desmontar
  useEffect(() => {
    return () => {
      if (session?.isAuthenticated) {
        notificationService.disconnect();
      }
    };
  }, [session?.isAuthenticated]);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}
