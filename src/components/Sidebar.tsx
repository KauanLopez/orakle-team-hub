// kauanlopez/orakle-team-hub/orakle-team-hub-b7bba0072f353722285dae4c4c15f7429fc7a5a4/src/components/Sidebar.tsx
import React from 'react';
import { 
  Home, 
  BarChart, 
  Trophy, 
  FileText, 
  Calendar, 
  Users, 
  Gift, 
  Gamepad2, 
  User, 
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'performance', label: 'Desempenho', icon: BarChart, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'ranking', label: 'Ranking', icon: Trophy, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'requests', label: 'Solicitações', icon: FileText, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'calendar', label: 'Calendário', icon: Calendar, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'team', label: 'Equipe', icon: Users, roles: ['supervisor', 'administrador'] },
    { id: 'rewards', label: 'Premiações', icon: Gift, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'games', label: 'Jogos', icon: Gamepad2, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'profile', label: 'Perfil', icon: User, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'support', label: 'Suporte AI', icon: MessageCircle, roles: ['colaborador', 'supervisor', 'administrador'] },
  ];

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'colaborador')
  );

  return (
    <>
      <div 
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">O</span>
                </div>
                {/* Sempre mostrar o texto em telas grandes */}
                <div className="hidden lg:block">
                  <h2 className="font-semibold text-slate-800">Menu</h2>
                  <p className="text-sm text-slate-600">{user?.team}</p>
                </div>
                {/* Mostrar o texto em mobile apenas se estiver aberto */}
                {isOpen && (
                  <div className="lg:hidden">
                    <h2 className="font-semibold text-slate-800">Menu</h2>
                    <p className="text-sm text-slate-600">{user?.team}</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden"
              >
                {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-slate-800">{user?.name}</div>
              <div className="text-xs text-slate-600 mt-1">{user?.position}</div>
              <div className="text-xs text-blue-600 font-medium mt-2">
                {user?.points} pontos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};