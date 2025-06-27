import React, { useState, useEffect } from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useFirebaseAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('orakle_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Pontuação Recebida',
          message: 'Você recebeu 15 pontos por participação no treinamento!',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'Solicitação Aprovada',
          message: 'Sua solicitação de troca de horário foi aprovada.',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: false
        }
      ];
      setNotifications(mockNotifications);
      localStorage.setItem('orakle_notifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('orakle_notifications', JSON.stringify(updatedNotifications));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'text-purple-700 bg-purple-100';
      case 'supervisor': return 'text-green-700 bg-green-100';
      default: return 'text-blue-700 bg-blue-100';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* A MUDANÇA ESTÁ AQUI */}
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">O</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Orakle
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
              <div className="p-3 font-semibold border-b">Notificações</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(notification.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role || '')}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
