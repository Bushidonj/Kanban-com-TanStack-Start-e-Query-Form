import { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, Check, CheckCheck, X, Users, AlertTriangle, ArrowRight, LogIn } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useSession } from '../../hooks/useSession';
import type { Notification } from '../../services/notification.service';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  // Sincronizar estados locais com os do hook
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    console.log('🔍 Marcando notificação como lida:', notificationId);
    markAsRead(notificationId);
    
    // ✅ Atualizar estado local imediatamente para feedback visual
    setLocalNotifications((prev: Notification[]) => 
      prev.map((n: Notification) => 
        n.id === notificationId 
          ? { ...n, isRead: true }
          : n
      )
    );
    
    // ✅ Atualizar contador local imediatamente
    const notificationToMark = localNotifications.find((n: Notification) => n.id === notificationId);
    if (notificationToMark && !notificationToMark.isRead) {
      setLocalUnreadCount((prev: number) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = () => {
    console.log('🔍 Marcando todas as notificações como lidas');
    markAllAsRead();
    setIsOpen(false);
    
    // ✅ Atualizar estado local imediatamente
    setLocalNotifications((prev: Notification[]) => 
      prev.map((n: Notification) => ({ ...n, isRead: true }))
    );
    setLocalUnreadCount(0);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'TASK_UNASSIGNED':
        return <X className="w-4 h-4 text-red-400" />;
      case 'TASK_STATUS_CHANGED':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    // ✅ CORREÇÃO: Converter para UTC primeiro, depois para local
    const date = new Date(dateString);
    const now = new Date();
    
    // Garantir que estamos trabalhando com datas válidas
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    // Calcular diferença em milissegundos considerando fuso horário
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    console.log(`🕐 Data recebida: ${dateString}`);
    console.log(`🕐 Data convertida: ${date.toISOString()}`);
    console.log(`🕐 Data local: ${date.toLocaleString()}`);
    console.log(`🕐 Diferença em minutos: ${diffInMinutes}`);

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h atrás`;
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do sino com animação */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-notion-hover transition-colors duration-200 group"
        title="Notificações"
      >
        {/* Sempre mostrar o sino */}
        {localUnreadCount > 0 && session?.isAuthenticated ? (
          <BellRing 
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-all duration-200 bell-bounce"
          />
        ) : (
          <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
        )}
        
        {/* Badge apenas se autenticado e tiver notificações */}
        {localUnreadCount > 0 && session?.isAuthenticated && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pulse-badge">
            {localUnreadCount > 9 ? '9+' : localUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden slide-down">
          {session?.isAuthenticated ? (
            <>
              {/* Header do dropdown para usuários autenticados */}
              <div className="flex items-center justify-between p-4 border-b border-notion-border">
                <h3 className="text-notion-text font-semibold">Notificações</h3>
                <div className="flex items-center gap-2">
                  {localUnreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Marcar todas como lidas
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-notion-text-muted hover:text-notion-text transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de notificações */}
              <div className="overflow-y-auto max-h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : localNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-notion-text-muted">
                    <Bell className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma notificação</p>
                  </div>
                ) : (
                  localNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-notion-border hover:bg-notion-hover transition-colors ${
                        !notification.isRead ? 'bg-notion-hover/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Ícone da notificação */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.isRead ? 'text-notion-text' : 'text-notion-text-muted'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-notion-text-muted mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.taskTitle && (
                                <div className="flex items-center gap-1 mt-2">
                                  <ArrowRight className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-notion-text-muted">{notification.taskTitle}</span>
                                </div>
                              )}
                            </div>

                            {/* Ações */}
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-notion-text-muted whitespace-nowrap">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {localNotifications.length > 0 && (
                <div className="p-3 border-t border-notion-border text-center">
                  <button className="text-xs text-notion-text-muted hover:text-notion-text transition-colors">
                    Ver todas as notificações
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Header do dropdown para não autenticados */}
              <div className="flex items-center justify-between p-4 border-b border-notion-border">
                <h3 className="text-notion-text font-semibold">Notificações</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Conteúdo para não autenticados */}
              <div className="flex flex-col items-center justify-center p-8 text-notion-text-muted">
                <LogIn className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm text-center mb-2">Faça login para ver suas notificações</p>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Fazer Login
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
